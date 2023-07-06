import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import FileService from '../../flox/modules/file/file.service';
import S3File from '../../flox/modules/file/entities/file.entity';
import AccessControlledEntity from '../../flox/modules/access-control/entities/access-controlled.entity';
import AccessControlService from '../../flox/modules/access-control/access-control.service';
import UserGroup from '../../flox/modules/access-control/entities/user-group.entity';
import UserService from '../../flox/modules/auth/user.service';
import Notification from '../../flox/modules/notifications/entities/notification.entity';
import NotificationService from '../../flox/modules/notifications/notification.service';
import Message from '../../flox/modules/notifications/entities/message.entity';
import User from '../../flox/modules/auth/entities/user.entity';
import EmailService from '../../flox/modules/email/email.service';

import Article from './entities/article.entity';
import ArticleResolver from './article.resolver';
import ArticleService from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      S3File,
      AccessControlledEntity,
      Message,
      Notification,
      User,
      UserGroup,
    ]),
  ],
  exports: [ArticleResolver, ArticleService],
  providers: [
    Article,
    ArticleResolver,
    ArticleService,
    AccessControlService,
    EmailService,
    FileService,
    NotificationService,
    UserService,
  ],
})
export default class ArticleModule {}
