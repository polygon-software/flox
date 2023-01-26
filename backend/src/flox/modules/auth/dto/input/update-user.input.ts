import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsLocale,
  IsLowercase,
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
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}
