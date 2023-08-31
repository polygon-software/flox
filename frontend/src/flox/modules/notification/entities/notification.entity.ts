import { IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import MessageEntity from 'src/flox/modules/notification/entities/message.entity';

/**
 * A class representing a notification
 */
export default class NotificationEntity extends BaseEntity {
  @IsOptional()
  @IsString()
  recipient?: UserEntity;

  @IsOptional()
  @IsString()
  read?: boolean;

  @IsOptional()
  messages?: MessageEntity[];
}
