import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';

import { BoundingBox } from './entities/bounding-box.entity';
import { Image } from './entities/image.entity';
import { Label } from './entities/label.entity';
import { ImageResolver } from './image.resolver';
import { ImageService } from './image.service';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([Image, BoundingBox, Label])],
  providers: [ImageService, ImageResolver],
})
export class ImageModule {}
