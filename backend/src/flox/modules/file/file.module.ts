import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import S3File from './entities/file.entity';
import { FileController } from './file.controller';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([S3File])],
  providers: [FileService, FileResolver],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
