import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ImageFile from './entities/image-file.entity';
import ImageFileService from './image-file.service';
import ImageFileResolver from './image-file.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ImageFile])],
  exports: [ImageFileService],
  providers: [ImageFile, ImageFileResolver, ImageFileService],
})
export default class ImageFileModule {}
