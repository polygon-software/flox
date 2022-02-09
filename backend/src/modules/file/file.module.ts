import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicFile } from './entities/public_file.entity';
import { ConfigService } from '@nestjs/config';
import { FileResolver } from './file.resolver';
import { PrivateFile } from './entities/private_file.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Offer } from '../offer/entities/offer.entity';
import { Dossier } from '../dossier/entity/dossier.entity';
import { Company } from '../company/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublicFile,
      PrivateFile,
      User,
      Offer,
      Dossier,
      Company,
    ]),
    UserModule,
  ],
  providers: [FileService, FileResolver, ConfigService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
