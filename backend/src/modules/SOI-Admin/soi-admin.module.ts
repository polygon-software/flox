import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { SoiAdmin } from './entities/soi-admin.entity';
import { SoiAdminService } from './soi-admin.service';
import { SoiAdminResolver } from './soi-admin.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SoiAdmin])],
  providers: [SoiAdminService, SoiAdminResolver, UserService],
})
export class SoiAdminModule {}
