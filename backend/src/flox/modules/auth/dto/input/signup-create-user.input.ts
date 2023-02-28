import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsLocale,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import CreateInput from '../../../abstracts/crud/dto/input/create.input';
import { PASSWORD_REGEX } from '../../../../REGEX';

@InputType()
export default class SignupCreateUserInput extends CreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String, { description: 'password' })
  @IsString()
  @Matches(PASSWORD_REGEX)
  password: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  @IsOptional()
  lang: string;
}
