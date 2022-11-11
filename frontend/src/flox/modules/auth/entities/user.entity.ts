import { IsOptional, IsString } from 'class-validator';

import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';

import { ROLE } from '../enums/role.enum';

/**
 * A class representing a user data object
 */
export class UserEntity extends BaseEntity {
  @IsOptional()
  role?: ROLE;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;
}