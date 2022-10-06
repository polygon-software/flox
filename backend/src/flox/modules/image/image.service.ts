import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
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
import { User } from '../auth/entities/user.entity';
import { ForbiddenError } from 'apollo-server-express';
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

  async getAllImages(getAllImagesArgs: GetAllImagesArgs): Promise<Image[]> {
    return this.imageRepository.find({
      take: getAllImagesArgs.limit,
      skip: getAllImagesArgs.skip,
    });
  }

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

  async getImageForFile(
    getImageForFileARgs: GetImageForFileArgs,
  ): Promise<Image> {
    const image = await this.imageRepository.findOneOrFail({
      where: {
        file: {
          uuid: getImageForFileARgs.file,
        },
      },
    });
    return this.getImage({ uuid: image.uuid } as GetImageArgs);
  }

  async createImage(
    createImageInput: CreateImageInput,
    user: User,
  ): Promise<Image> {
    const file = await this.fileService.getPrivateFile({
      uuid: createImageInput.file,
    } as GetPrivateFileArgs);
    if (file.owner !== user.uuid) {
      throw new ForbiddenError(
        'Cannot create image for file that belongs to someone else.',
      );
    }
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
    console.log('rekognitionData', rekognitionData);

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

    console.log('rekognizedLabels', rekognizedLabels);

    const labelPromises = rekognizedLabels.map(async (label) => {
      console.log('before', label.boundingBox);
      const boundingBox = this.boundingBoxRepository.create(label.boundingBox);
      console.log('created bbox', boundingBox);
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

  async deleteImage(deleteImageInput: DeleteImageInput): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        uuid: deleteImageInput.uuid,
      },
      relations: {
        file: true,
      },
    });
    const removedImage = await this.imageRepository.remove(image);
    await this.fileService.deleteFile(
      { uuid: image.file.uuid } as DeleteFileInput,
      true,
    );
    return removedImage;
  }
}
