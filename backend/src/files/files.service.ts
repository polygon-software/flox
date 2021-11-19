import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './public_file.entity';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as Process from 'process';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * TODO docstrings
   * @param dataBuffer
   * @param filename
   */
  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
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
    try {
      const file = 'TODO'; // TODO
      const fileName = 'test-file.txt';
      const uploadParams = {
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: `${uuid()}-${filename}`,
        Body: file,
      };
      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        alert('Successfully uploaded FILE.');
      } catch (err) {
        return alert('There was an error uploading your file');
      }
    } catch (err) {
      console.log('blubb err', err);
      // if (!file) { // TODO
      //   return alert('Choose a file to upload first.');
      // }
    }

    const uploadResult = await s3

      .send()
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }
}
