import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsLocale,
  IsLowercase,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import CreateInput from '../../../abstracts/crud/inputs/create.input';
import DELIVERY_MEDIUMS from '../../../../enum/DELIVERY_MEDIUMS';
import ROLE from '../../../../enum/USER_ROLES';

@InputType()
export default class AdminCreateUserInput extends CreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
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

  @Field(() => ROLE)
  @IsEnum(ROLE)
  role: ROLE;

  @Field(() => [DELIVERY_MEDIUMS])
  @IsArray()
  deliveryMediums: DELIVERY_MEDIUMS[];

  @Field(() => String, { nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;
}
