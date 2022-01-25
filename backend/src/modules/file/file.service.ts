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
import { ERRORS } from '../../error/ERRORS';
import { MultipartFile } from 'fastify-multipart';
import { FILE_TYPE, ROLE } from '../../ENUM/ENUMS';
import { parseCsv } from '../../helpers/csv-helpers';

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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,

    @InjectRepository(Dossier)
    private readonly dossierRepository: Repository<Dossier>,

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
   * @param {FILE_TYPE} fileType - The type of the file
   * @param {string} owner - the file owner's UUID
   * @param {Record<string, Company|Offer|Dossier>} association - the entity the file is associated to
   * @returns {Promise<PrivateFile>} - file
   */
  async uploadPrivateFile(
    dataBuffer: Buffer,
    filename: string,
    fileType: FILE_TYPE,
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
      file_type: fileType,
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
    // TODO delete on S3
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
   * @param {FILE_TYPE} fileType - The type of the file
   * @param {string} associationUuid - The Id of the entity to associate with
   * @param {string} repositoryName - The name of the repository where the entity can be found. Needs to be injected.
   * @param {Record<'onAssociation' | 'onFile', string>} location - Where the file and entity link to each other
   * @param {string} ownerUuid - Cognito Id of owner. Use file-helper.js to add necessary headers
   * @returns {unknown} - The updated entity
   */
  async uploadAssociatedFile(
    file: MultipartFile,
    fileType: FILE_TYPE,
    associationUuid: string,
    repositoryName: string,
    location: Record<'onAssociation' | 'onFile', string | null>,
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

    const user = await this.userRepository.findOne(ownerUuid);
    if (!user) {
      throw new Error(ERRORS.no_user_found);
    }
    const fileBuffer = await file.toBuffer();
    const newFile = await this.uploadPrivateFile(
      fileBuffer,
      file.filename,
      fileType,
      user.fk,
      location.onFile ? { [location.onFile]: associatedEntity } : {},
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
      const oldFileUuid = associatedEntity[location.onAssociation].uuid;
      associatedEntity[location.onAssociation] = newFile;
      await this[repositoryName].save(associatedEntity);

      await this.deletePrivateFile(oldFileUuid);
    }
    await this[repositoryName].save(associatedEntity);
    return associatedEntity;
  }

  /**
   * Allow access to files on a Dossier to related employees, companies, banks and admins
   * @param {GetPrivateFileArgs} getPrivateFileArgs - arguments, containing UUID
   * @param {User} dbUser - user requesting file
   * @returns {Promise<PrivateFile>} - res with presigned url
   */
  async getDossierDocument(
    getPrivateFileArgs: GetPrivateFileArgs,
    dbUser: User,
  ): Promise<PrivateFile> {
    const file = await this.privateFilesRepository.findOne(
      getPrivateFileArgs.uuid,
      {
        relations: [
          'dossier',
          'dossier.offers',
          'dossier.offers.bank',
          'dossier.employee',
          'dossier.employee.company',
        ],
      },
    );

    if (
      (dbUser.role === ROLE.BANK && //Banks can access files of dossiers they have offer to
        file.dossier.offers.some((offer) => {
          return offer.bank.uuid === dbUser.fk;
        })) ||
      (dbUser.role === ROLE.COMPANY && // Companies can access files of dossiers that one of their employees created
        file.dossier.employee.company.uuid === dbUser.fk) ||
      (dbUser.role === ROLE.EMPLOYEE && // Employees can access files of dossiers they created
        file.dossier.employee.uuid === dbUser.fk) ||
      dbUser.role === ROLE.SOI_ADMIN // Admins can do whatever
    ) {
      return this.preparePrivateFile(getPrivateFileArgs, file);
    }
    throw new NotFoundException();
  }

  /**
   * Allow access to files on a offer to related employees, companies, banks and admins
   * @param {GetPrivateFileArgs} getPrivateFileArgs - arguments, containing UUID
   * @param {User} dbUser - user requesting file
   * @returns {Promise<PrivateFile>} - res with presigned url
   */
  async getOffersFile(
    getPrivateFileArgs: GetPrivateFileArgs,
    dbUser: User,
  ): Promise<PrivateFile> {
    const file = await this.privateFilesRepository.findOne(
      getPrivateFileArgs.uuid,
      {
        relations: [
          'offer',
          'offer.bank',
          'offer.dossier',
          'offer.dossier.employee',
          'offer.dossier.employee.company',
        ],
      },
    );

    if (
      (dbUser.role === ROLE.BANK && file.offer.bank.uuid === dbUser.fk) ||
      (dbUser.role === ROLE.COMPANY &&
        file.offer.dossier.employee.company.uuid === dbUser.fk) ||
      (dbUser.role === ROLE.EMPLOYEE &&
        file.offer.dossier.employee.uuid === dbUser.fk) ||
      dbUser.role === ROLE.SOI_ADMIN
    ) {
      return this.preparePrivateFile(getPrivateFileArgs, file);
    }
    throw new NotFoundException();
  }

  /**
   * Uploads a value development CSV file
   * @param {MultipartFile} file - multipart CSV file input
   * @returns {Promise<void>} - file
   */
  async uploadValueDevelopmentFile(file: MultipartFile) {
    console.log('TODO upload file:', file.filename);
    const fileBuffer = await file.toBuffer();

    const parsedCsv = await parseCsv(fileBuffer);
    console.log('parsed:', parsedCsv);
    // // File upload
    // const key = file.filename;
    // const uploadParams = {
    //   Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
    //   Key: key,
    //   Body: fileBuffer,
    // };
    // await this.s3.send(new PutObjectCommand(uploadParams));

    // TODO: Do we not just want to decode and so on?
  }
}
