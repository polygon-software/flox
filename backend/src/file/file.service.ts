import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './entities/public_file.entity';
import PrivateFile from './entities/private_file.entity';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { GetPublicFileArgs } from './dto/get-public-file.args';
import { GetPrivateFileArgs } from './dto/get-private-file.args';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileService {
  // S3 credentials
  private readonly credentials = {
    region: this.configService.get('AWS_REGION'),
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  };

  // AWS S3 instance
  private s3: S3 = new S3({
    credentials: this.credentials,
  });
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Uploads a file to the public S3 bucket
   * @param {Buffer} dataBuffer - data buffer representation of the file to upload
   * @param {string} filename - the file's name
   */
  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    // File upload
    const key = `${uuid()}-${filename}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    const configService = new ConfigService();
    const newFile = this.publicFilesRepository.create({
      key: key,
      url: `https://${configService.get(
        'AWS_PUBLIC_BUCKET_NAME',
      )}.s3.${configService.get('AWS_REGION')}.amazonaws.com/${key}`,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  /**
   * Uploads a file to the private S3 bucket
   * @param {Buffer} dataBuffer - data buffer representation of the file to upload
   * @param {string} filename - the file's name
   */
  async uploadPrivateFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<PrivateFile> {
    //File upload
    const key = `${uuid()}-${filename}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    const newFile = this.privateFilesRepository.create({
      key: key,
      owner: 'todo', // TODO
    });
    await this.privateFilesRepository.save(newFile);
    return newFile;
  }

  /**
   * Gets a public file from the database
   * @param {GetPublicFileArgs} getPublicFileArgs - arguments, containing UUID
   */
  async getPublicFile(
    getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.publicFilesRepository.findOne(getPublicFileArgs.uuid);
  }

  /**
   * Gets a private file from the database
   * @param {GetPrivateFileArgs} getPrivateFileArgs - arguments, containing UUID TODO more?
   */
  async getPrivateFile(
    getPrivateFileArgs: GetPrivateFileArgs,
  ): Promise<PrivateFile> {
    const fileInfo = await this.privateFilesRepository.findOne(
      getPrivateFileArgs.uuid,
    );
    // TODO actual authentication
    if (fileInfo) {
      // Generate presigned URL
      const url = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: fileInfo.key,
        }),
      );
      console.log('Private file URL', url);
      return this.privateFilesRepository.findOne(getPrivateFileArgs.uuid);
    }

    throw new NotFoundException();
  }

  /**
   * Gets a private file from the database TODO not working yet
   * @param {GetPrivateFileArgs} getPrivateFileArgs - arguments, containing UUID TODO more?
   */
  async getPrivateFileAsStream(
    getPrivateFileArgs: GetPrivateFileArgs,
  ): Promise<ReadableStream<unknown>> {
    const fileInfo = await this.privateFilesRepository.findOne(
      getPrivateFileArgs.uuid,
    );
    // TODO actual authentication
    if (fileInfo) {
      const fileStream = await this.s3.getObject({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: fileInfo.key,
      });
      const stream = fileStream.Body;
      console.log('GET file stream', stream, 'with info', fileInfo);
      return stream as ReadableStream; // TODO
    }
    throw new NotFoundException();
    //return this.privateFilesRepository.findOne(getPrivateFileArgs.uuid);
  }
}
