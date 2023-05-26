import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import FormEntity from 'src/data/form/entities/form.entity';

/**
 * A class representing an expense data object
 */
export default class ExpenseEntity extends BaseEntity {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  timeAmount?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsObject()
  @IsOptional()
  form?: FormEntity;
}
