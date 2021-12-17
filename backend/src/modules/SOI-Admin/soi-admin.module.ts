import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { SoiAdmin } from './entities/soi-admin.entity';
import { SoiAdminService } from './soi-admin.service';
import { SoiAdminResolver } from './soi-admin.resolver';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SoiAdmin, User])],
  providers: [SoiAdminService, SoiAdminResolver, UserService],
})
/**
 * A SOI Admin Module
 */
export class SoiAdminModule {}
