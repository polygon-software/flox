import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/publicFile.entity';
import { FileResolver } from './file.resolver';
import { PrivateFile } from './entities/privateFile.entity';
import S3File from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile, PrivateFile, S3File])],
  providers: [FileService, FileResolver],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
