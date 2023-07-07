import { IsInt, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * A class representing an article suggestion data object
 */
export default class ArticleSuggestionEntity extends BaseEntity {
  @IsString()
  @IsOptional()
  articleNumber?: string;

  @IsString()
  @IsOptional()
  manufacturerNumber?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  amount?: number;

  @IsInt()
  @IsOptional()
  price?: number;
}
