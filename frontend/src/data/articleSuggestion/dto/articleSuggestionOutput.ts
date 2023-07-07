import { IsNumber, IsOptional } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * A class representing a data object. Used when creating articles from the ERP export.
 * Amount states how many articles where created.
 */
export default class ArticleSuggestionOutput extends BaseEntity {
  @IsNumber()
  @IsOptional()
  amount?: number;
}
