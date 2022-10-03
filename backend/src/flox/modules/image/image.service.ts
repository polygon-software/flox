import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Image from './entities/image.entity';
import { Repository } from 'typeorm';
import { GetImageArgs } from './dto/args/get-image.args';
import { GetImageForFileArgs } from './dto/args/get-image-for-file.args';
import { CreateImageInput } from './dto/input/create-image.input';
import { FileService } from '../file/file.service';
import { DeleteImageInput } from './dto/input/delete-image.input';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    private readonly fileService: FileService,
  ) {}

  async getImage(getImageArgs: GetImageArgs): Promise<Image> {
    return this.imageRepository.findOne({
      where: {
        uuid: getImageArgs.uuid,
      },
    });
  }

  async getImageForFile(
    getImageForFileARgs: GetImageForFileArgs,
  ): Promise<Image> {
    return this.imageRepository.findOne({
      where: {
        file: getImageForFileARgs.file,
      },
    });
  }

  async createImage(createImageInput: CreateImageInput): Promise<Image> {
    if (!this.fileService.fileExists(createImageInput.file)) {
      throw new NotFoundException(
        `File with uuid ${createImageInput.file} does not exist`,
      );
    }
    return this.imageRepository.create({
      file: createImageInput.file,
    });
  }

  async deleteImage(deleteImageInput: DeleteImageInput): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: {
        uuid: deleteImageInput.uuid,
      },
    });
    return this.imageRepository.remove(image);
  }
}
