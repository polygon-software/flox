import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsLocale,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

import UpdateInput from '../../../abstracts/crud/inputs/update.input';

@InputType()
export default class UpdateUserInput extends UpdateInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(25)
  username: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
