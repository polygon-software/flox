import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoiAdmin } from './entities/soi-admin.entity';
import { SoiAdminService } from './soi-admin.service';
import { SoiAdminResolver } from './soi-admin.resolver';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SoiAdmin, User]), UserModule],
  providers: [SoiAdminService, SoiAdminResolver],
})
/**
 * A SOI Admin Module
 */
export class SoiAdminModule {}
