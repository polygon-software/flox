import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsLocale,
  IsLowercase,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import DELIVERY_MEDIUMS from '../../../../enum/DELIVERY_MEDIUMS';
import ROLE from '../../../../enum/USER_ROLES';
import { PASSWORD_REGEX } from '../../../../REGEX';

@ObjectType()
export default class AdminCreateUserOutput {
  @Field(() => String, { description: 'Username' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username: string;

  @Field(() => String, { description: 'E-mail address' })
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'Preferred language of user' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang: string;

  @Field(() => String, { description: 'Cognito UUID' })
  @IsString()
  cognitoUuid: string;

  @Field(() => ROLE, { description: 'User role' })
  @IsEnum(ROLE)
  role: ROLE;

  @Field(() => [DELIVERY_MEDIUMS])
  @IsArray()
  deliveryMediums: DELIVERY_MEDIUMS[];

  @Field(() => String, { nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @Field(() => String, { description: 'password', nullable: true })
  @IsString()
  @IsOptional()
  @Matches(PASSWORD_REGEX)
  password: string;
}
