import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/public_file.entity';
import { ConfigService } from '@nestjs/config';
import { FileResolver } from './file.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile])],
  providers: [FileService, ConfigService, FileResolver],
  controllers: [FileController],
})
export class FileModule {}
