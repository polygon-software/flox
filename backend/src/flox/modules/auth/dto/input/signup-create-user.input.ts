import { Field, InputType } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';

import { PASSWORD_REGEX } from '../../../../REGEX';

import CreateUserInput from './create-user.input';

@InputType()
export default class SignupCreateUserInput extends CreateUserInput {
  @Field(() => String, { description: 'password' })
  @IsString()
  @Matches(PASSWORD_REGEX)
  password: string;
}
