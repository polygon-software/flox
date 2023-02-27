import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../../../REGEX';
import User from '../../entities/user.entity';

@ObjectType()
export default class AdminCreateUserOutput {
  @Field(() => User, { description: 'Created user' })
  data: User;

  @Field(() => String, { description: 'password', nullable: true })
  @IsString()
  @IsOptional()
  @Matches(PASSWORD_REGEX)
  password?: string;
}
