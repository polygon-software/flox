import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserModule from '../auth/user.module';
import User from '../auth/entities/user.entity';
import NotificationModule from '../notifications/notification.module';

import UserGroup from './entities/user-group.entity';
import AccessControlService from './access-control.service';
import AccessControlResolver from './access-control.resolver';
import AccessControlledEntity from './entities/access-controlled.entity';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    TypeOrmModule.forFeature([User, UserGroup, AccessControlledEntity]),
  ],
  providers: [AccessControlService, AccessControlResolver],
  exports: [AccessControlService],
})
export default class AccessControlModule {}
