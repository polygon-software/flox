import { IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';

/**
 * Class that represents a user group
 */
export default class UserGroupEntity extends BaseEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  users?: UserEntity[];
}
