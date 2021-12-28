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
import { Company } from '../company/entities/company.entity';
import { User } from '../user/entities/user.entity';
import { Offer } from '../offer/entities/offer.entity';
import { Dossier } from '../dossier/entity/dossier.entity';

@Injectable()
export class FileService {
  // S3 credentials
  private readonly credentials = {
    region: this.configService.get('AWS_REGION'),
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  };

  // AWS S3 instance
  private readonly s3: S3 = new S3({
    credentials: this.credentials,
  });
  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFilesRepository: Repository<PublicFile>,

    @InjectRepository(PrivateFile)
    private readonly privateFilesRepository: Repository<PrivateFile>,

    private readonly configService: ConfigService,
  ) {}

  /**
   * Uploads a file to the public S3 bucket
   * @param {Buffer} dataBuffer - data buffer representation of the file to upload
   * @param {string} filename - the file's name
   * @returns {Promise<PublicFile>} - file
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
   * @param {string} owner - the file owner's UUID
   * @param {Record<string, Company|Offer|Dossier>} association - the entity the file is associated to
   * @returns {Promise<PrivateFile>} - file
   */
  async uploadPrivateFile(
    dataBuffer: Buffer,
    filename: string,
    owner: string,
    association: Record<string, Company | Offer | Dossier>,
  ): Promise<PrivateFile> {
    // File upload
    const key = `${uuid()}-${filename}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    };

    const fileInput = {
      key: key,
      owner: owner,
      ...association,
    };

    const newFile = this.privateFilesRepository.create(fileInput);

    await this.s3.send(new PutObjectCommand(uploadParams));
    await this.privateFilesRepository.save(newFile);

    return newFile;
  }

  /**
   * Gets a public file from the database
   * @param {GetPublicFileArgs} getPublicFileArgs - arguments, containing UUID
   * @returns {Promise<PublicFile>} - file
   */
  async getPublicFile(
    getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.publicFilesRepository.findOne(getPublicFileArgs.uuid);
  }

  /**
   * Gets a private file from the database
   * @param {GetPrivateFileArgs} getPrivateFileArgs - arguments, containing UUID
   * @param {User} dbUser - user requesting file
   * @returns {Promise<PrivateFile>} - file
   */
  async getPrivateFile(
    getPrivateFileArgs: GetPrivateFileArgs,
    dbUser: User,
  ): Promise<PrivateFile> {
    const fileInfo = await this.privateFilesRepository.findOne({
      uuid: getPrivateFileArgs.uuid,
      owner: dbUser.fk,
    });
    if (fileInfo) {
      const options: Record<string, unknown> = {};
      // If expiration duration is set, apply
      if (getPrivateFileArgs.expires) {
        options.expiresIn = getPrivateFileArgs.expires;
      }

      // Generate pre-signed URL
      const url = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
          Key: fileInfo.key,
        }),
        options,
      );
      const result = await this.privateFilesRepository.findOne(
        getPrivateFileArgs.uuid,
      );

      // Add URL to result
      return { ...result, url };
    }

    throw new NotFoundException();
  }

  /**
   * Deletes a Private File
   * @param {string} fileUuid - file to delete
   * @returns {Promise<PrivateFile>} - deleted file
   */
  async deletePrivateFile(fileUuid: string): Promise<PrivateFile> {
    const file = await this.privateFilesRepository.findOne(fileUuid);
    await this.privateFilesRepository.delete(file.uuid);
    return file;
  }
}
