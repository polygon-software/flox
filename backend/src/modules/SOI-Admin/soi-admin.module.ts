import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoiAdmin } from './entities/soi-admin.entity';
import { SoiAdminService } from './soi-admin.service';
import { SoiAdminResolver } from './soi-admin.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SoiAdmin]), UserModule],
  providers: [SoiAdminService, SoiAdminResolver],
  exports: [SoiAdminService],
})
/**
 * A SOI Admin Module
 */
export class SoiAdminModule {}
