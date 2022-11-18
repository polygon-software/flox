import {
  IsLocale,
  IsLowercase,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

export default class MessageEntity extends BaseEntity {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsLowercase()
  @IsLocale()
  lang?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  link?: string;
}
