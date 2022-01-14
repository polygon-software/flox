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
import { User } from '../user/entities/user.entity';
import { ERRORS } from '../../error/ERRORS';
import { MultipartFile } from 'fastify-multipart';
import { Product } from '../product/entities/product.entity';

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

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private readonly configService: ConfigService,
  ) {}

  /**
   * Uploads a file to the public S3 bucket
   * @param {Buffer} dataBuffer - data buffer representation of the file to upload
   * @param {string} filename - the file's name
   * @param {string} productId - UUID of the corresponding product
   * @returns {Promise<PublicFile>} - the newly created file
   */
  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    productId: string,
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

    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new Error(`Product ${productId} does not exist`);
    }

    const newFile = this.publicFilesRepository.create({
      key,
      url: `https://${configService.get(
        'AWS_PUBLIC_BUCKET_NAME',
      )}.s3.${configService.get('AWS_REGION')}.amazonaws.com/${key}`,
      product: product,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  /**
   * Uploads a file to the private S3 bucket
   * @param {Buffer} dataBuffer - data buffer representation of the file to upload
   * @param {string} filename - the file's name
   * @param {string} owner - the file owner's UUID
   * @param {Record<string, Product|user>} association - the entity the file is associated to
   * @returns {Promise<PrivateFile>} - file
   */
  async uploadPrivateFile(
    dataBuffer: Buffer,
    filename: string,
    owner: string,
    association: Record<string, Product | User>, // TODO gotta ensure this is right
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
   * @param {User} user - user requesting file
   * @returns {Promise<PrivateFile>} - file
   */
  async getPrivateFile(
    getPrivateFileArgs: GetPrivateFileArgs,
    user: User,
  ): Promise<PrivateFile> {
    const fileInfo = await this.privateFilesRepository.findOne({
      uuid: getPrivateFileArgs.uuid,
      owner: user.uuid,
    });
    if (fileInfo) {
      return this.preparePrivateFile(getPrivateFileArgs, fileInfo);
    }

    throw new NotFoundException();
  }

  /**
   * Generate a presigned URL and return it with the file object
   * @param {GetPrivateFileArgs} getPrivateFileArgs - arguments, containing UUID
   * @param {PrivateFile} fileInfo - the file to download
   * @returns {Promise<PrivateFile>} - file
   */
  async preparePrivateFile(
    getPrivateFileArgs: GetPrivateFileArgs,
    fileInfo: PrivateFile,
  ) {
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

  /**
   * Creates a private file from given file
   * Sets the owner based on the incoming cognitoId
   * Adds the file to an entity given by the associationUuid in the repository given by repositoryName
   * at the field given by location.onAssociation. If the location is an array, the new file is appended.
   * Otherwise the field is overwritten.
   * Adds the entity to the file at the field given by location.onFile
   * @param {MultipartFile} file - The file
   * @param {string} associationUuid - The Id of the entity to associate with
   * @param {string} repositoryName - The name of the repository where the entity can be found. Needs to be injected.
   * @param {Record<'onAssociation' | 'onFile', string>} location - Where the file and entity link to each other
   * @param {string} ownerUuid - Cognito Id of owner. Use file-helper.js to add necessary headers
   * @returns {unknown} - The updated entity
   */
  async uploadAssociatedFile(
    file: MultipartFile,
    associationUuid: string,
    repositoryName: string,
    location: Record<'onAssociation' | 'onFile', string>,
    ownerUuid: string,
  ): Promise<Record<string, unknown>> {
    if (!file) {
      throw new Error(ERRORS.no_valid_file);
    }

    const associatedEntity = await this[repositoryName].findOne(
      associationUuid,
      {
        relations: [location.onAssociation],
      },
    );
    // Throw error if invalid associated Entity
    if (!associatedEntity) {
      throw new Error(ERRORS.no_valid_association);
    }

    const fileBuffer = await file.toBuffer();
    const newFile = await this.uploadPrivateFile(
      fileBuffer,
      file.filename,
      ownerUuid,
      { [location.onFile]: associatedEntity },
    );
    if (
      // Empty location -> add
      associatedEntity[location.onAssociation] === null ||
      associatedEntity[location.onAssociation] === undefined
    ) {
      associatedEntity[location.onAssociation] = newFile;
    } else if (Array.isArray(associatedEntity[location.onAssociation])) {
      // Location is an Array -> extend
      associatedEntity[location.onAssociation].push(newFile);
    } else {
      // File found on location -> delete existing file and override
      await this.deletePrivateFile(
        associatedEntity[location.onAssociation].uuid,
      );
      associatedEntity[location.onAssociation] = newFile;
    }
    await this[repositoryName].save(associatedEntity);
    return associatedEntity;
  }
}
