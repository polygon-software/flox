import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import LabelEntity from 'src/flox/modules/image/entities/label.entity';

/**
 * Class representing an image data object
 */
export default class ImageEntity extends BaseEntity {
  @IsOptional()
  file?: FileEntity;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsDate()
  @IsOptional()
  capturedAt?: Date;

  @IsOptional()
  labels?: LabelEntity[];
}
