import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/public_file.entity';
import { ConfigService } from '@nestjs/config';
import { FileResolver } from './file.resolver';
import { PrivateFile } from './entities/private_file.entity';
import { Company } from '../company/entities/company.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile, PrivateFile, Company, User])],
  providers: [FileService, ConfigService, FileResolver, UserService],
  controllers: [FileController],
})
export class FileModule {}
