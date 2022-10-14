import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DetectLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import exifr from 'exifr';
import Image from './entities/image.entity';
import { Repository } from 'typeorm';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { CreateImageInput } from './dto/input/create-image.input';
import { FileService } from '../file/file.service';
import { DeleteImageInput } from './dto/input/delete-image.input';
import { GetPrivateFileArgs } from '../file/dto/args/get-private-file.args';
import { GetAllImagesArgs } from './dto/args/get-all-images.args';
import { DeleteFileInput } from '../file/dto/input/delete-file.input';
import { ConfigService } from '@nestjs/config';
import { CreateLabelsInput } from './dto/input/create-labels.input';
import { Label } from './entities/label.entity';
import { BoundingBox } from './entities/bounding-box.entity';

@Injectable()
export class ImageService {
  // Rekognition credentials
  private readonly credentials = {
    region: this.configService.get('AWS_MAIN_REGION'),
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
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
  ) {}

  /**
   * Returns all images stored within the database
   * @param {GetAllImagesArgs} getAllImagesArgs - contains take and skip parameters
   * @returns {Promise<Image[]>} Images
   */
  async getAllImages(getAllImagesArgs: GetAllImagesArgs): Promise<Image[]> {
    return this.imageRepository.find({
      take: getAllImagesArgs.take,
      skip: getAllImagesArgs.skip,
    });
  }

  /**
   * Queries for one Image
   * @param {GetImageArgs} getImageArgs - contains image uuid
   * @returns {Promise<Image>} Queried image
   */
  async getImage(getImageArgs: GetImageArgs): Promise<Image> {
    const image = await this.imageRepository.findOneOrFail({
      where: {
        uuid: getImageArgs.uuid,
      },
      relations: {
        file: true,
        labels: {
          boundingBox: true,
        },
      },
    });
    const file = await this.fileService.getPrivateFile({
      uuid: image.file.uuid,
    } as GetPrivateFileArgs);
    return {
      ...image,
      file,
    };
  }

  /**
   * Queries for an image given the file uuid
   * @param {GetImageForFileArgs} getImageForFileArgs - contains uuid of file
   * @returns {Promise<Image>} Queried image
   */
  async getImageForFile(
    getImageForFileArgs: GetImageForFileArgs,
  ): Promise<Image> {
    const image = await this.imageRepository.findOneOrFail({
      where: {
        file: {
          uuid: getImageForFileArgs.file,
        },
      },
    });
    return this.getImage({ uuid: image.uuid } as GetImageArgs);
  }

  /**
   * Creates a new image given a file
   * @param {CreateImageInput} createImageInput - contains file uuid
   * @returns {Promise<Image>} Created Image
   */
  async createImage(createImageInput: CreateImageInput): Promise<Image> {
    const file = await this.fileService.getPrivateFile({
      uuid: createImageInput.file,
    } as GetPrivateFileArgs);
    const imageMetaData = (await exifr.parse(file.url)) || {};
    const newImage = this.imageRepository.create({
      file,
      width: imageMetaData.ExifImageWidth ?? imageMetaData.ImageWidth,
      height: imageMetaData.ExifImageHeight ?? imageMetaData.ImageHeight,
      latitude: imageMetaData.latitude ?? null,
      longitude: imageMetaData.longitude ?? null,
      capturedAt: imageMetaData.DateTimeOriginal ?? null,
    });
    await this.imageRepository.save(newImage);

    if (createImageInput.objectRecognition) {
      await this.createLabelsForImage({
        image: newImage.uuid,
      } as CreateLabelsInput);
    }

    return this.getImage({ uuid: newImage.uuid } as GetImageArgs);
  }

  /**
   * Performs object recognition on image and stores appropriate labels to database
   * @param {CreateLabelsInput} createLabelsInput - contains uuid of image to perform object recognition
   * @returns {Promise<Image>} Image wit labels
   */
  async createLabelsForImage(
    createLabelsInput: CreateLabelsInput,
  ): Promise<Image> {
    const image = await this.getImage({
      uuid: createLabelsInput.image,
    } as GetImageArgs);

    const rekognitionData = await this.rekognition.send(
      new DetectLabelsCommand({
        Image: {
          S3Object: {
            Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
            Name: image.file.key,
          },
        },
      }),
    );

    const rekognizedLabels = rekognitionData.Labels.map((label) => {
      return label.Instances.map((instance) => ({
        image: image,
        name: label.Name,
        confidence: instance.Confidence,
        parents: label.Parents.map((parent) => parent.Name),
        boundingBox: {
          width: instance.BoundingBox.Width,
          height: instance.BoundingBox.Height,
          left: instance.BoundingBox.Left,
          top: instance.BoundingBox.Top,
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
   * @param {DeleteImageInput} deleteImageInput - contains the uuid of the image to delete
   * @returns {Promise<Image>} Deleted Image
   */
  async deleteImage(deleteImageInput: DeleteImageInput): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        uuid: deleteImageInput.uuid,
      },
      relations: {
        file: true,
      },
    });
    await this.fileService.deleteFile(
      { uuid: image.file.uuid } as DeleteFileInput,
      true,
    );
    return image;
  }
}
