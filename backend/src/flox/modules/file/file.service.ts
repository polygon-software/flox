import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './entities/publicFile.entity';
import PrivateFile from './entities/privateFile.entity';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { GetPublicFileArgs } from './dto/args/get-public-file.args';
import { GetPrivateFileArgs } from './dto/args/get-private-file.args';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteFileInput } from './dto/input/delete-file.input';
import { GetAllFilesArgs } from './dto/args/get-all-files.args';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class FileService {
  // S3 credentials
  private readonly credentials = {
    region: this.configService.get('AWS_MAIN_REGION'),
    accessKeyId: this.configService.get('ADMIN_AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('ADMIN_AWS_SECRET_ACCESS_KEY'),
  };

  // AWS S3 instance
  private s3: S3 = new S3({
    credentials: this.credentials,
    region: this.credentials.region,
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
   * @param {Express.Multer.File} file - the file to upload
   * @returns {Promise<PublicFile>} - the newly uploaded file
   */
  async uploadPublicFile(file: Express.Multer.File): Promise<PublicFile> {
    // File upload
    const key = `${uuid()}-${file.originalname}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    const configService = new ConfigService();

    const url = `https://${configService.get(
      'AWS_PUBLIC_BUCKET_NAME',
    )}.s3.${configService.get('AWS_MAIN_REGION')}.amazonaws.com/${key}`;

    const newFile = this.publicFilesRepository.create({
      key,
      url,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename || file.originalname,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  /**
   * Uploads a file to the private S3 bucket
   * @param {Express.Multer.File} file - the file to upload
   * @param {User} owner - the file owner
   * @returns {Promise<PrivateFile>} - the newly uploaded file
   */
  async uploadPrivateFile(
    file: Express.Multer.File,
    owner: User,
  ): Promise<PrivateFile> {
    //File upload
    const key = `${uuid()}-${file.originalname}`;
    const uploadParams = {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
    };
    await this.s3.send(new PutObjectCommand(uploadParams));
    const newFile = this.privateFilesRepository.create({
      key,
      owner: owner.uuid,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename || file.originalname,
    });
    await this.privateFilesRepository.save(newFile);
    return newFile;
  }

  /**
   * Gets a public file
   * @param {GetPublicFileArgs} getPublicFileArgs - contains UUID
   * @returns {Promise<PublicFile>} - the file
   */
  async getPublicFile(
    getPublicFileArgs: GetPublicFileArgs,
  ): Promise<PublicFile> {
    return this.publicFilesRepository.findOne({
      where: {
        uuid: getPublicFileArgs.uuid,
      },
    });
  }

  /**
   * Returns all public files stored within database
   * @param {GetAllFilesArgs} getAllFilesArgs - contains take and skip parameters
   * @returns {Promise<PublicFile[]>} List of public files
   */
  async getAllPublicFiles(
    getAllFilesArgs: GetAllFilesArgs,
  ): Promise<Array<PublicFile>> {
    return this.publicFilesRepository.find({
      take: getAllFilesArgs.take,
      skip: getAllFilesArgs.skip,
    });
  }

  /**
   * Returns private files of logged in user
   * @param {GetAllFilesArgs} getAllFilesArgs - contains take and skip parameters
   * @param {User} user - currently logged in user
   * @returns {Promise<PrivateFile[]>} Users private files
   */
  async getAllMyFiles(
    getAllFilesArgs: GetAllFilesArgs,
    user: User,
  ): Promise<Array<PrivateFile>> {
    const usersFileUUIDs = await this.privateFilesRepository.find({
      where: {
        owner: user.uuid,
      },
    });
    return Promise.all(
      usersFileUUIDs.map((file) => this.getPrivateFile({ uuid: file.uuid })),
    );
  }

  /**
   * Gets a private file
   * @param {GetPrivateFileArgs} getPrivateFileArgs - contains UUID and optionally, expiration time
   * @returns {Promise<PrivateFile>} - the file
   */
  async getPrivateFile(
    getPrivateFileArgs: GetPrivateFileArgs,
  ): Promise<PrivateFile> {
    const fileInfo = await this.privateFilesRepository.findOne({
      where: {
        uuid: getPrivateFileArgs.uuid,
      },
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
      const result = await this.privateFilesRepository.findOne({
        where: {
          uuid: getPrivateFileArgs.uuid,
        },
      });

      // Add URL to result
      return { ...result, url };
    }

    // File not found: throw error
    throw new NotFoundException();
  }

  /**
   * Deletes a private or public file
   * @param {DeleteFileInput} deleteFileInput - contains UUID
   * @param {boolean} isPublic - whether the file is public (otherwise, is private)
   * @returns {Promise<PrivateFile|PublicFile>} - the file that was deleted
   */
  async deleteFile(
    deleteFileInput: DeleteFileInput,
    isPublic: boolean,
  ): Promise<PrivateFile | PublicFile> {
    const repository = isPublic
      ? this.publicFilesRepository
      : this.privateFilesRepository;

    const file: PrivateFile | PublicFile = await repository.findOne({
      where: {
        uuid: deleteFileInput.uuid,
      },
    });

    if (file) {
      // Delete on S3
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get(
            isPublic ? 'AWS_PUBLIC_BUCKET_NAME' : 'AWS_PRIVATE_BUCKET_NAME',
          ),
          Key: file.key,
        }),
      );

      // Delete in database (TypeScript does not understand variable typing between PrivateFile / PublicFile here)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const deletedFile = await repository.remove(file);
      deletedFile.uuid = deleteFileInput.uuid;
      return deletedFile;
    }

    // File not found: throw error
    throw new NotFoundException();
  }
}
