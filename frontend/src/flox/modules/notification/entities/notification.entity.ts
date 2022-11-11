import { IsOptional, IsString } from 'class-validator';

import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';

/**
 * A class representing a file
 */
export class NotificationEntity extends BaseEntity {
  @IsOptional()
  @IsString()
  receiver?: UserEntity;

  @IsOptional()
  @IsString()
  read?: boolean;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  deTitle?: string;

  @IsOptional()
  @IsString()
  deContent?: string;

  @IsOptional()
  @IsString()
  enTitle?: string;

  @IsOptional()
  @IsString()
  enContent?: string;
}
