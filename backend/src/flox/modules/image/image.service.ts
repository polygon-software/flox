import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DetectLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import { parse } from 'exifr';
import { FindOneOptions, Repository } from 'typeorm';

import GetOneArgs from '../abstracts/crud/dto/args/get-one.args';
import DeleteInput from '../abstracts/crud/dto/input/delete.input';
import { assertReadAccess } from '../access-control/helpers/access-control.helper';
import AbstractSearchAccessControlService from '../abstracts/search-access-control/abstract-search-access-control.service';
import User from '../auth/entities/user.entity';
import FileService from '../file/file.service';
import AccessControlService from '../access-control/access-control.service';
import { mergeOptions } from '../abstracts/crud/helpers/crud.helper';

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
import ImageSearchOutput from './dto/output/image-search.output';

@Injectable()
export default class ImageService extends AbstractSearchAccessControlService<Image> {
  // Rekognition credentials
  private readonly credentials = {
    region: this.configService.getOrThrow<string>('AWS_MAIN_REGION'),
    accessKeyId: this.configService.getOrThrow<string>(
      'AWS_ADMIN_ACCESS_KEY_ID',
    ),
    secretAccessKey: this.configService.getOrThrow<string>(
      'AWS_ADMIN_SECRET_ACCESS_KEY',
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

  /**
   * @returns image repository
   */
  get repository(): Repository<Image> {
    return this.imageRepository;
  }

  /**
   * Retrieves a single image from the database, ensuring the provided user has access to it by either being owner or
   * allowed reader of the image. Alternatively, the image can be public, then the user has also access to it.
   *
   * @param getImageArgs - contains uuid of image to be retrieved
   * @param user - the user that retrieves the image
   * @param options - additional type ORM find options that are applied to find query
   * @returns the one image that was received
   */
  async getImage(
    getImageArgs: GetImageArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image> {
    const mergedOptions = mergeOptions<Image>(
      {
        relations: {
          file: true,
          labels: {
            boundingBox: true,
          },
        },
      },
      options,
    );
    const image = await super.getOneAsUser(getImageArgs, user, mergedOptions);
    const file = await this.fileService.getOneAsUser(
      {
        uuid: image.file.uuid,
      } as GetOneArgs,
      user,
    );
    const fileWithUrl = await this.fileService.addFileUrl(file, getImageArgs);
    return {
      ...image,
      file: fileWithUrl,
    };
  }

  /**
   * Retrieves multiple images explicitely specified by their uuid. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these images.
   *
   * @param getMultipleImagesArgs - contains a list of uuids of the images to retrieve
   * @param user - the user that retrieves the image
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  async getMultipleImages(
    getMultipleImagesArgs: GetMultipleImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getMultipleAsUser(
      getMultipleImagesArgs,
      user,
      mergeOptions<Image>(
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
        const fileWithUrl = await this.fileService.addFileUrl(
          file,
          getMultipleImagesArgs,
        );
        return {
          ...image,
          file: fileWithUrl,
        };
      }),
    );
  }

  /**
   * Retrieves multiple images explicitely specified by their uuid. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these images. This
   * endpoint does not return public images, though, since they do not explicitely belong to the user.
   *
   * @param getMultipleImagesArgs - contains a list of uuids of the images to retrieve
   * @param user - the user that retrieves the image
   * @param options - additional type ORM find options that are applied to find query
   * @returns the list of found entities
   */
  async getMultipleImagesOfUser(
    getMultipleImagesArgs: GetMultipleImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getMultipleOfUser(
      getMultipleImagesArgs,
      user,
      mergeOptions<Image>(
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
        const fileWithUrl = await this.fileService.addFileUrl(
          file,
          getMultipleImagesArgs,
        );
        return {
          ...image,
          file: fileWithUrl,
        };
      }),
    );
  }

  /**
   * Retrieves all images from a database with applying pagination. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these images.
   *
   * @param getAllImagesArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the image
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  async getAllImages(
    getAllImagesArgs: GetAllImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getAllAsUser(
      getAllImagesArgs,
      user,
      mergeOptions<Image>(
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
        const fileWithUrl = await this.fileService.addFileUrl(
          file,
          getAllImagesArgs,
        );
        return {
          ...image,
          file: fileWithUrl,
        };
      }),
    );
  }

  /**
   * Retrieves all images from a database with applying pagination. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these images. This
   * endpoint does not return public images, though, since they do not explicitely belong to the user.
   *
   * @param getAllImagesArgs - contains pagination parameters (skip, take)
   * @param user - the user that retrieves the image
   * @param options - additional type ORM find options that are applied to find query
   * @returns page of entities
   */
  async getAllImagesOfUser(
    getAllImagesArgs: GetAllImagesArgs,
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<Image[]> {
    const images = await super.getAllOfUser(
      getAllImagesArgs,
      user,
      mergeOptions<Image>(
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
        const fileWithUrl = await this.fileService.addFileUrl(
          file,
          getAllImagesArgs,
        );
        return {
          ...image,
          file: fileWithUrl,
        };
      }),
    );
  }

  /**
   * Queries for an image given the file uuid
   *
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
      ...this.readAccessControlRelationOptions,
      where: {
        file: {
          uuid: getImageForFileArgs.file,
        },
      },
    });
    assertReadAccess(image, user);
    return this.getImage(
      {
        uuid: image.uuid,
        expires: getImageForFileArgs.expires,
      } as GetImageArgs,
      user,
    );
  }

  /**
   * Queries for all entities that fit query criteria. It only returns the entities that are public, the
   * user is the owner or the user is part of an access group that has read access to these images.
   *
   * @param searchImageArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param user - user that retrieves entities
   * @param options - query options to extend search
   * @returns images that fit criteria
   */
  async searchImages(
    searchImageArgs: SearchImagesArgs,
    searchKeys: (keyof Image)[],
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<ImageSearchOutput> {
    const { count, data } = await super.searchAsUser(
      searchImageArgs,
      searchKeys,
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
   * Queries for all entities that fit query criteria. It only returns the entities that the
   * user is the owner or the user is part of an access group that has read access to these images. This
   * endpoint does not return public images, though, since they do not explicitely belong to the user.
   *
   * @param searchImageArgs - contain table filtering rules
   * @param searchKeys - key on which search string value is being searched
   * @param user - user that retrieves entities
   * @param options - query options to extend search
   * @returns images that fit criteria
   */
  async searchMyImages(
    searchImageArgs: SearchImagesArgs,
    searchKeys: (keyof Image)[],
    user: User,
    options?: FindOneOptions<Image>,
  ): Promise<ImageSearchOutput> {
    const { count, data } = await super.searchOfUser(
      searchImageArgs,
      searchKeys,
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
   * Creates a new image based on the create input and sets the user as the images owner.
   *
   * @param createImageInput - specifications of image, must be deep partial of image
   * @param user - the user that creates the image
   * @returns the created image
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
    if (!file.mimetype.startsWith('image/')) {
      throw new HttpException(
        'File is not an image',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    file = await this.fileService.addFileUrl(file, { expires: 60 });
    let imageMetaData = {
      ImageWidth: undefined,
      ImageHeight: undefined,
      ExifImageWidth: undefined,
      ExifImageHeight: undefined,
      latitude: undefined,
      longitude: undefined,
      DateTimeOriginal: undefined,
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed: Record<string, unknown> = await parse(file.url ?? '');
      imageMetaData = {
        ...imageMetaData,
        ...parsed,
      };
    } catch (e: any) {
      console.error(e);
    }
    const newImage = await super.create(createImageInput, user, {
      file,
      width: imageMetaData.ExifImageWidth ?? imageMetaData.ImageWidth,
      height: imageMetaData.ExifImageHeight ?? imageMetaData.ImageHeight,
      latitude: imageMetaData.latitude,
      longitude: imageMetaData.longitude,
      capturedAt: imageMetaData.DateTimeOriginal,
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
   *
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
        image,
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
   *
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
