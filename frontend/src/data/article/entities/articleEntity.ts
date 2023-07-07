import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import FormEntity from 'src/data/form/entities/form.entity';

/**
 * A class representing an article data object
 */
export default class ArticleEntity extends BaseEntity {
  @IsString()
  @IsOptional()
  articleNumber?: string;

  @IsString()
  @IsOptional()
  manufacturerNumber?: string;

  @IsInt()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsObject()
  @IsOptional()
  form?: FormEntity;
}
