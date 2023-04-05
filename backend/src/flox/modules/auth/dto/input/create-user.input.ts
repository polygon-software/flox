import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsLocale,
  IsLowercase,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import CreateInput from '../../../abstracts/crud/dto/input/create.input';

@InputType()
export default class CreateUserInput extends CreateInput {
  @Field(() => String)
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username: string;

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
