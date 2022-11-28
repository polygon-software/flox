import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsLocale,
  IsLowercase,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import CreateInput from '../../../abstracts/crud/inputs/create.input';

@InputType()
export default class CreateUserInput extends CreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  cognitoUuid: string;

  @Field(() => String, { nullable: true })
  @IsString()
  role: string;
}
