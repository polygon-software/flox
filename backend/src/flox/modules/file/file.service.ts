import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import S3File from './entities/file.entity';
import { AbstractSearchAccessControlService } from '../abstracts/search-access-control/abstract-search-access-control.service';

@Injectable()
export class FileService extends AbstractSearchAccessControlService<S3File> {
  // S3 credentials
  private readonly credentials = {
    region: this.configService.get('AWS_MAIN_REGION'),
    accessKeyId: this.configService.get('ADMIN_AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('ADMIN_AWS_SECRET_ACCESS_KEY'),
  };

  get repository(): Repository<S3File> {
    return this.fileRepository;
  }

  // AWS S3 instance
  private s3: S3 = new S3({
    credentials: this.credentials,
    region: this.credentials.region,
  });
  constructor(
    @InjectRepository(S3File)
    private fileRepository: Repository<S3File>,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  /**
   * Creates a presigned URL for uploading a file
   * @param file - database entry of file
   * @returns pre-signed URL for upload
   */
  async createSignedUploadUrl(file: S3File): Promise<string> {
    const uploadParams = {
      Bucket: this.configService.get(
        file.publicReadAccess
          ? 'AWS_PUBLIC_BUCKET_NAME'
          : 'AWS_PRIVATE_BUCKET_NAME',
      ),
      Key: file.key,
      Body: 'BODY',
    };
    const command = new PutObjectCommand(uploadParams);
    return getSignedUrl(this.s3, command, {
      expiresIn: 60 * 60,
    });
  }

  /**
   * Add url to file objects for private files
   * @param file - S3 File from Database
   * @param args - contains UUID and optionally, expiration time
   * @returns the file including an url from which it can be accessed
   */
  async addFileUrl(file: S3File, args: { expires?: number }): Promise<S3File> {
    if (file.publicReadAccess) {
      return file;
    }
    const options = {
      expiresIn: args.expires ?? undefined,
    };
    // Generate pre-signed URL
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: file.key,
      }),
      options,
    );
    // Add URL to result
    return { ...file, url };
  }

  /**
   * Adds urls to an array of files
   * @param files - files on which url shall be added
   * @param args - contains expiry
   * @returns files with url
   */
  async addFileUrls(
    files: S3File[],
    args: { expires?: number },
  ): Promise<S3File[]> {
    return Promise.all(files.map((f) => this.addFileUrl(f, args)));
  }

  /**
   * Deletes an S3 from S3. Be sure to have the database entry deleted manually as well.
   * @param file - database entry that was already deleted
   * @returns the file that was deleted
   */
  async deleteFileFromS3(file: S3File): Promise<S3File> {
    // Delete on S3
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get(
          file.publicReadAccess
            ? 'AWS_PUBLIC_BUCKET_NAME'
            : 'AWS_PRIVATE_BUCKET_NAME',
        ),
        Key: file.key,
      }),
    );
    file.url = undefined;
    return file;
  }
}
