import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import AbstractSearchService from '../../flox/modules/abstracts/search/abstract-search.service';

import ImageFile from './entities/image-file.entity';

@Injectable()
export default class ImageFileService extends AbstractSearchService<ImageFile> {
  // S3 credentials
  private readonly credentials = {
    region: this.configService.getOrThrow<string>('AWS_MAIN_REGION'),
    accessKeyId: this.configService.getOrThrow<string>(
      'AWS_ADMIN_ACCESS_KEY_ID',
    ),
    secretAccessKey: this.configService.getOrThrow<string>(
      'AWS_ADMIN_SECRET_ACCESS_KEY',
    ),
  };

  // AWS S3 instance
  private s3: S3 = new S3({
    credentials: this.credentials,
    region: this.credentials.region,
  });

  constructor(
    @InjectRepository(ImageFile)
    private readonly imageFileRepository: Repository<ImageFile>,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  /**
   * @returns form repository
   */
  get repository(): Repository<ImageFile> {
    return this.imageFileRepository;
  }

  /**
   * Creates a presigned URL for uploading a file
   *
   * @param file - database entry of file
   * @returns pre-signed URL for upload
   */
  async createSignedUploadUrl(file: ImageFile): Promise<string> {
    const uploadParams = {
      Bucket: this.configService.get<string>('AWS_PRIVATE_BUCKET_NAME'),
      Key: file.uuid,
      'Content-Type': file.mimetype,
    };
    const command = new PutObjectCommand(uploadParams);
    return getSignedUrl(this.s3, command, {
      expiresIn: 60 * 60,
    });
  }

  /**
   * Loads a file from S3 and converts it to base64.
   *
   * @param file - file to be loaded
   * @returns base64 string of file
   */
  async fileToBase64(file: ImageFile): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: file.uuid,
    });

    const response = await this.s3.send(command);
    if (response.Body) {
      return Buffer.from(await response.Body.transformToByteArray()).toString(
        'base64',
      );
    }
    throw new Error('File could not be loaded from S3');
  }
}
