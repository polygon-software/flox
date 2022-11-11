import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../auth/user.module';

import Notification from './entities/notification.entity';
import NotificationService from './notification.service';
import NotificationResolver from './notification.resolver';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
