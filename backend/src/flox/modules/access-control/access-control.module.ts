import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../auth/user.module';

import UserGroup from './entities/user-group.entity';
import AccessControlService from './access-control.service';
import AccessControlResolver from './access-control.resolver';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserGroup])],
  providers: [AccessControlService, AccessControlResolver],
  exports: [AccessControlService],
})
export default class AccessControlModule {}
