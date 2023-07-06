import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import FormEntity from 'src/data/form/entities/form.entity';

/**
 * A class representing a protocol data object
 */
export default class ProtocolEntity extends BaseEntity {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  articleNumber?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  discount?: string;

  @IsString()
  @IsOptional()
  sum?: string;

  @IsObject()
  @IsOptional()
  form?: FormEntity;
}
