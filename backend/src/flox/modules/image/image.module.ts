import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageResolver } from './image.resolver';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([Image])],
  providers: [ImageService, ImageResolver],
})
export class ImageModule {}
