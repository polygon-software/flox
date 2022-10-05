import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    private readonly fileService: FileService,
  ) {}

  async getAllImages(getAllImagesArgs: GetAllImagesArgs): Promise<Image[]> {
    return this.imageRepository.find({
      take: getAllImagesArgs.limit,
      skip: getAllImagesArgs.skip,
    });
  }

  async getImage(getImageArgs: GetImageArgs): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        uuid: getImageArgs.uuid,
      },
      relations: {
        file: true,
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
    const image = await this.imageRepository.findOne({
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
    const imageMetaData = await exifr.parse(file.url);
    console.log(imageMetaData);
    const newImage = this.imageRepository.create({
      file,
      width: imageMetaData.ExifImageWidth,
      height: imageMetaData.ExifImageHeight,
      latitude: imageMetaData.latitude,
      longitude: imageMetaData.longitude,
      capturedAt: imageMetaData.DateTimeOriginal,
    });
    console.log(newImage);
    await this.imageRepository.save(newImage);
    return this.getImage({ uuid: newImage.uuid } as GetImageArgs);
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
