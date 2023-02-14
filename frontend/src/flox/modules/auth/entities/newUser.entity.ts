import { IsOptional, IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../form/data/REGEX';

import UserEntity from './user.entity';

/**
 * A class representing a user data object
 */
export default class NewUserEntity extends UserEntity {
  @IsOptional()
  @IsString()
  @Matches(PASSWORD_REGEX)
  password?: string;
}
