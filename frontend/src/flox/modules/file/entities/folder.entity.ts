import { IsInt, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * A class representing a folder
 */
export default class FolderEntity extends BaseEntity {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  files?: number;

  @IsOptional()
  @IsInt()
  size?: number;
}
