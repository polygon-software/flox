import { IsDecimal, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import BoundingboxEntity from 'src/flox/modules/image/entities/boundingbox.entity';

/**
 * Class representing a rekognized entity on the image with a bounding-box
 */
export default class LabelEntity extends BaseEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDecimal()
  confidence?: number;

  @IsOptional()
  @IsString({ each: true })
  parents?: string[];

  @IsOptional()
  boundingBox?: BoundingboxEntity;
}
