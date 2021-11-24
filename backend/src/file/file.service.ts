import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './entities/public_file.entity';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { GetFileArgs } from './dto/get-file.args';
import PrivateFile from './entities/private_file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
    private s3: S3,
  ) {
    // S3 credentials
    const credentials = {
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    };

    // AWS S3 instance
    this.s3 = new S3({
      credentials: credentials,
    });
  }

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
   * @param dataBuffer
   * @param filename
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
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  async getFile(getFileArgs: GetFileArgs): Promise<PublicFile> {
    return this.publicFilesRepository.findOne(getFileArgs.uuid);
  }
}
