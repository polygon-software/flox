import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DetectLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import exifr from 'exifr';
import { FindOneOptions, Repository } from 'typeorm';

import GetOneArgs from '../abstracts/crud/dto/get-one.args';
import DeleteInput from '../abstracts/crud/inputs/delete.input';
import { assertReadAccess } from '../access-control/helpers/access-control.helper';
import AbstractSearchAccessControlService from '../abstracts/search-access-control/abstract-search-access-control.service';
import User from '../auth/entities/user.entity';
import FileService from '../file/file.service';
import { NestedKeyOf } from '../../../types/NestedKeyOf';
import AccessControlService from '../access-control/access-control.service';

import GetAllImagesArgs from './dto/args/get-all-images.args';
import GetImageArgs from './dto/args/get-image.args';
import GetImageForFileArgs from './dto/args/get-image-for-file.args';
import GetMultipleImagesArgs from './dto/args/get-multiple-images.args';
import CreateImageInput from './dto/input/create-image.input';
import CreateLabelsInput from './dto/input/create-labels.input';
import BoundingBox from './entities/bounding-box.entity';
import Image from './entities/image.entity';
import Label from './entities/label.entity';
import SearchImagesArgs from './dto/args/search-images.args';
import ImageSearchOutput from './outputs/image-search.output';

@Injectable()
export default class ImageService extends AbstractSearchAccessControlService<Image> {
  // Rekognition credentials
  private readonly credentials = {
    region: this.configService.getOrThrow('AWS_MAIN_REGION'),
    accessKeyId: this.configService.getOrThrow('ADMIN_AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow(
      'ADMIN_AWS_SECRET_ACCESS_KEY',
    ),
  };

  // Rekognition instance
  private rekognition: RekognitionClient = new RekognitionClient({
    credentials: this.credentials,
    region: this.credentials.region,
  });

  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(Label)
    private labelRepository: Repository<Label>,

    @InjectRepository(BoundingBox)
    private boundingBoxRepository: Repository<BoundingBox>,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    protected readonly accessControlService: AccessControlService,
  ) {
    super();
  }

  get repository(): Repository<Image> {
    return this.imageRepository;
  }

  /**
   * Queries for one Image
   * @param getImageArgs - contains image uuid
   * @param user - user that owns image
   * @param options - additional options to get an image
   * @returns Queried image
   */
  async getImage(
    getImageArgs: GetImageArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image> {
    const image = await super.getOneAsUser(
      getImageArgs,
      user,
      this.mergeOptions(
        {
          relations: {
            file: true,
            labels: {
              boundingBox: true,
            },
          },
        },
        options,
      ),
    );
    const file = await this.fileService.getOneAsUser(
      {
        uuid: image.file.uuid,
      } as GetOneArgs,
      user,
    );
    return {
      ...image,
      file,
    };
  }

  /**
   * Returns all images stored within the database
   * @param getMultipleImagesArgs - contains uuids of images
   * @param user - user that owns images
   * @param options - additional options to get an image
   * @returns Images
   */
  async getMultipleImages(
    getMultipleImagesArgs: GetMultipleImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getMultipleAsUser(
      getMultipleImagesArgs,
      user,
      this.mergeOptions(
        {
          relations: {
            file: true,
            labels: {
              boundingBox: true,
            },
          },
        },
        options,
      ),
    );
    return Promise.all(
      images.map(async (image) => {
        const file = await this.fileService.getOneAsUser(
          {
            uuid: image.file.uuid,
          } as GetOneArgs,
          user,
        );
        return {
          ...image,
          file,
        };
      }),
    );
  }

  async getMultipleImagesOfUser(
    getMultipleImagesArgs: GetMultipleImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getMultipleOfUser(
      getMultipleImagesArgs,
      user,
      this.mergeOptions(
        {
          relations: {
            file: true,
            labels: {
              boundingBox: true,
            },
          },
        },
        options,
      ),
    );
    return Promise.all(
      images.map(async (image) => {
        const file = await this.fileService.getOneAsUser(
          {
            uuid: image.file.uuid,
          } as GetOneArgs,
          user,
        );
        return {
          ...image,
          file,
        };
      }),
    );
  }

  /**
   * Returns all images stored within the database
   * @param getAllImagesArgs - contains take and skip parameters
   * @param user - user that owns images
   * @param options - additional options to get an image
   * @returns Images
   */
  async getAllImages(
    getAllImagesArgs: GetAllImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getAllAsUser(
      getAllImagesArgs,
      user,
      this.mergeOptions(
        {
          relations: {
            file: true,
            labels: {
              boundingBox: true,
            },
          },
        },
        options,
      ),
    );
    return Promise.all(
      images.map(async (image) => {
        const file = await this.fileService.getOneAsUser(
          {
            uuid: image.file.uuid,
          } as GetOneArgs,
          user,
        );
        return {
          ...image,
          file,
        };
      }),
    );
  }

  async getAllImagesOfUser(
    getAllImagesArgs: GetAllImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getAllOfUser(
      getAllImagesArgs,
      user,
      this.mergeOptions(
        {
          relations: {
            file: true,
            labels: {
              boundingBox: true,
            },
          },
        },
        options,
      ),
    );
    return Promise.all(
      images.map(async (image) => {
        const file = await this.fileService.getOneAsUser(
          {
            uuid: image.file.uuid,
          } as GetOneArgs,
          user,
        );
        return {
          ...image,
          file,
        };
      }),
    );
  }

  /**
   * Queries for an image given the file uuid
   * @param getImageForFileArgs - contains uuid of file
   * @param user - user that needs to have the right to access the image
   * @param options - additional options to get an image
   * @returns Queried image
   */
  async getImageForFile(
    getImageForFileArgs: GetImageForFileArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image> {
    const image = await this.imageRepository.findOneOrFail({
      ...options,
      where: this.mixWhere(
        [
          {
            file: {
              uuid: getImageForFileArgs.file,
            },
            publicReadAccess: true,
          },
          {
            file: {
              uuid: getImageForFileArgs.file,
            },
            loggedInReadAccess: true,
          },
          {
            file: {
              uuid: getImageForFileArgs.file,
            },
            owner: {
              uuid: user.uuid,
            },
          },
          {
            file: {
              uuid: getImageForFileArgs.file,
            },
            readAccess: {
              users: {
                uuid: user.uuid,
              },
            },
          },
        ],
        this.extractWhere(options),
      ),
    });
    return this.getImage(
      {
        uuid: image.uuid,
        expires: getImageForFileArgs.expires,
      } as GetImageArgs,
      user,
    );
  }

  async searchImages(
    searchImageArgs: SearchImagesArgs,
    searchKey: NestedKeyOf<Image>,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<ImageSearchOutput> {
    const { count, data } = await super.searchAsUser(
      searchImageArgs,
      searchKey,
      user,
      options,
    );
    const images = await this.getMultipleImages(
      {
        uuids: data.map((image) => image.uuid),
        expires: searchImageArgs.expires,
      } as GetMultipleImagesArgs,
      user,
    );
    return {
      count,
      data: images,
    };
  }

  async searchMyImages(
    searchImageArgs: SearchImagesArgs,
    searchKey: NestedKeyOf<Image>,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<ImageSearchOutput> {
    const { count, data } = await super.searchOfUser(
      searchImageArgs,
      searchKey,
      user,
      options,
    );
    const images = await this.getMultipleImages(
      {
        uuids: data.map((image) => image.uuid),
        expires: searchImageArgs.expires,
      } as GetMultipleImagesArgs,
      user,
    );
    return {
      count,
      data: images,
    };
  }

  /**
   * Creates a new image given a file
   * @param createImageInput - contains file uuid
   * @param user - user that needs to have the right to access the image
   * @returns Created Image
   */
  async createImage(
    createImageInput: CreateImageInput,
    user: User,
  ): Promise<Image> {
    let file = await this.fileService.getOneAsUser(
      {
        uuid: createImageInput.file,
      } as GetOneArgs,
      user,
      this.fileService.writeAccessControlRelationOptions,
    );
    assertReadAccess(file, user);
    file = await this.fileService.addFileUrl(file, { expires: 60 });
    console.log(JSON.stringify(file), user.uuid);
    const imageMetaData = (await exifr.parse(file.url ?? '')) || {};
    const newImage = await super.create(createImageInput, user, {
      file,
      width: imageMetaData.ExifImageWidth ?? imageMetaData.ImageWidth,
      height: imageMetaData.ExifImageHeight ?? imageMetaData.ImageHeight,
      latitude: imageMetaData.latitude ?? null,
      longitude: imageMetaData.longitude ?? null,
      capturedAt: imageMetaData.DateTimeOriginal ?? null,
    });

    if (createImageInput.objectRecognition) {
      await this.createLabelsForImage(
        {
          image: newImage.uuid,
        } as CreateLabelsInput,
        user,
      );
    }

    return this.getImage({ uuid: newImage.uuid } as GetImageArgs, user);
  }

  /**
   * Performs object recognition on image and stores appropriate labels to database
   * @param createLabelsInput - contains uuid of image to perform object recognition
   * @param user - user that needs to have the right to access the image
   * @returns Image wit labels
   */
  async createLabelsForImage(
    createLabelsInput: CreateLabelsInput,
    user: User,
  ): Promise<Image> {
    const image = await this.getImage(
      {
        uuid: createLabelsInput.image,
      } as GetImageArgs,
      user,
      this.writeAccessControlRelationOptions,
    );
    assertReadAccess(image, user);

    const rekognitionData = await this.rekognition.send(
      new DetectLabelsCommand({
        Image: {
          S3Object: {
            Bucket: this.configService.getOrThrow('AWS_PRIVATE_BUCKET_NAME'),
            Name: image.file.uuid,
          },
        },
      }),
    );

    if (!rekognitionData.Labels) {
      throw new Error('No labels detected on provided image');
    }
    const rekognizedLabels = rekognitionData.Labels.map((label) => {
      if (!label.Instances) {
        return [];
      }
      return label.Instances.map((instance) => ({
        image: image,
        name: label.Name,
        confidence: instance.Confidence,
        parents: label.Parents
          ? label.Parents.map((parent) => parent.Name ?? '')
          : ([] as string[]),
        boundingBox: {
          width: instance?.BoundingBox?.Width,
          height: instance?.BoundingBox?.Height,
          left: instance?.BoundingBox?.Left,
          top: instance?.BoundingBox?.Top,
        },
      }));
    }).flat();

    const labelPromises = rekognizedLabels.map(async (label) => {
      const boundingBox = this.boundingBoxRepository.create(label.boundingBox);
      await this.boundingBoxRepository.save(boundingBox);
      const newLabel = this.labelRepository.create({
        ...label,
        boundingBox,
      });
      return this.labelRepository.save(newLabel);
    });

    image.labels = await Promise.all(labelPromises);
    return this.imageRepository.save(image);
  }

  /**
   * Removes the database entry of a given image without deleting the file
   * @param deleteInput - contains the uuid of the image to delete
   * @param user - user that needs to have the right to access the image
   * @returns Deleted Image
   */
  async deleteImage(deleteInput: DeleteInput, user: User): Promise<Image> {
    const image = await this.getOneAsUser(deleteInput, user, {
      relations: {
        file: true,
      },
    });
    await this.fileService.delete(
      { uuid: image.file.uuid } as DeleteInput,
      user,
    );
    return image;
  }
}
