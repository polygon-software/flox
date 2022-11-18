import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AccessControlModule from '../access-control/access-control.module';

import S3File from './entities/file.entity';
import FileResolver from './file.resolver';
import FileService from './file.service';

@Module({
  imports: [AccessControlModule, TypeOrmModule.forFeature([S3File])],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export default class FileModule {}
