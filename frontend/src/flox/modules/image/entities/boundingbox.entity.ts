import { IsDecimal, IsOptional } from 'class-validator';

import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * Class representing an image data object
 */
export class BoundingboxEntity extends BaseEntity {
  @IsOptional()
  @IsDecimal()
  width?: number;

  @IsOptional()
  @IsDecimal()
  height?: number;

  @IsOptional()
  @IsDecimal()
  left?: number;

  @IsOptional()
  @IsDecimal()
  top?: number;
}
