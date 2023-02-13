import { IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

import ROLE from '../../../enum/USER_ROLES';

/**
 * A class representing a user data object
 */
export default class UserEntity extends BaseEntity {
  @IsOptional()
  role?: ROLE;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
