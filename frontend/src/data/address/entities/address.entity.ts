import { IsInt, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * A class representing an address data object
 */
export default class AddressEntity extends BaseEntity {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsInt()
  @IsOptional()
  zipCode?: number;

  @IsString()
  @IsOptional()
  additionalAddress?: string;
}
