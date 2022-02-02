import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { Announcement } from '../announcement/entities/announcement.entity';
import { AnnouncementService } from '../announcement/announcement.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Announcement]),
    AnnouncementService,
    UserService,
  ],
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
