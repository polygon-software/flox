import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './public_file.entity';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
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
    // S3 credentials
    const credentials = {
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    };

    // AWS S3 instance
    const s3 = new S3({
      credentials: credentials,
    });

    // Actual file upload
    const key = `${uuid()}-${filename}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    };
    const uploadResult = await s3.send(new PutObjectCommand(uploadParams));
    console.log('Successfully uploaded FILE.');

    const newFile = this.publicFilesRepository.create({
      key: key,
      url: `TODO_urlforfile_${key}`,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }
}
