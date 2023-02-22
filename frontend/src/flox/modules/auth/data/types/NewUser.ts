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

import DELIVERY_MEDIUMS from 'src/flox/enum/DELIVERY_MEDIUMS';
import { PASSWORD_REGEX } from 'src/flox/modules/form/data/REGEX';

import ROLE from '../../../../enum/USER_ROLES';

export default class NewUser {
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang: string;

  @IsString()
  cognitoUuid: string;

  @IsEnum(ROLE)
  role: ROLE;

  @IsArray()
  deliveryMediums: DELIVERY_MEDIUMS[];

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @Matches(PASSWORD_REGEX)
  password: string;

  constructor(
    username: string,
    email: string,
    lang: string,
    cognitoUuid: string,
    role: ROLE,
    deliveryMediums: DELIVERY_MEDIUMS[],
    phoneNumber: string,
    password: string
  ) {
    this.username = username;
    this.email = email;
    this.lang = lang;
    this.cognitoUuid = cognitoUuid;
    this.role = role;
    this.deliveryMediums = deliveryMediums;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }
}
