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
import { v4 as uuid } from 'uuid';
import { GetFileArgs } from './dto/args/get-file.args';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { User } from '../auth/entities/user.entity';
import { AbstractCrudAccessControlService } from '../abstracts/crud-access-control/abstract-crud-access-control.service';
import S3File from './entities/file.entity';
import { GetMultipleArgs } from '../abstracts/crud/dto/get-multiple.args';
import { GetMultipleFilesArgs } from './dto/args/get-multiple-files.args';
import { GetAllFilesArgs } from './dto/args/get-all-files.args';

@Injectable()
export class FileService extends AbstractCrudAccessControlService<S3File> {
  // S3 credentials
  private readonly credentials = {
    region: this.configService.getOrThrow('AWS_MAIN_REGION'),
    accessKeyId: this.configService.getOrThrow('ADMIN_AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow(
      'ADMIN_AWS_SECRET_ACCESS_KEY',
    ),
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
   * Uploads a file to the private or public S3 bucket
   * @param content - file content as uploaded by the user
   * @param file - database entry of file
   * @returns file including access url
   */
  async uploadS3File(
    content: Express.Multer.File,
    file: S3File,
  ): Promise<S3File> {
    //File upload
    const uploadParams = {
      Bucket: this.configService.getOrThrow(
        file.publicReadAccess
          ? 'AWS_PUBLIC_BUCKET_NAME'
          : 'AWS_PRIVATE_BUCKET_NAME',
      ),
      Key: file.key,
      Body: content.buffer,
      ContentType: content.mimetype,
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    await this.fileRepository.update(file.uuid, {
      mimetype: content.mimetype,
      size: content.size,
      filename: content.filename || content.originalname,
    });
    if (file.publicReadAccess) {
      const url = `https://${this.configService.getOrThrow(
        'AWS_PUBLIC_BUCKET_NAME',
      )}.s3.${this.configService.getOrThrow('AWS_MAIN_REGION')}.amazonaws.com/${
        file.key
      }`;
      await this.fileRepository.update(file.uuid, { url });
    } else {
      return this.addFileUrl(file, { expires: 60 * 60 * 24 } as GetFileArgs);
    }
    return file;
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
        Bucket: this.configService.getOrThrow('AWS_PRIVATE_BUCKET_NAME'),
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
        Bucket: this.configService.getOrThrow(
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
