import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import FileModule from '../file/file.module';
import AccessControlModule from '../access-control/access-control.module';

import BoundingBox from './entities/bounding-box.entity';
import Image from './entities/image.entity';
import Label from './entities/label.entity';
import ImageResolver from './image.resolver';
import ImageService from './image.service';

@Module({
  imports: [
    AccessControlModule,
    FileModule,
    TypeOrmModule.forFeature([Image, BoundingBox, Label]),
  ],
  providers: [ImageService, ImageResolver],
})
export default class ImageModule {}
