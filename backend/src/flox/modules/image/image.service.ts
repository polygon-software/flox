import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { DEFAULT_ROLES } from '../roles/config';
import { ForbiddenError } from 'apollo-server-express';

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
    return this.imageRepository.findOne({
      where: {
        uuid: getImageArgs.uuid,
      },
    });
  }

  async getImageForFile(
    getImageForFileARgs: GetImageForFileArgs,
    user: User,
  ): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        file: {
          uuid: getImageForFileARgs.file,
        },
      },
    });
    if (user.role !== DEFAULT_ROLES.ADMIN && image.file.owner !== user.uuid) {
      throw new ForbiddenError('File does not belong to logged in user');
    }
    return image;
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
    return this.imageRepository.create({
      file,
    });
  }

  async deleteImage(deleteImageInput: DeleteImageInput): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        uuid: deleteImageInput.uuid,
      },
    });
    // TODO delete linked file as well?
    return this.imageRepository.remove(image);
  }
}
