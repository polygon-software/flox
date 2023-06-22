import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import AddressEntity from 'src/data/address/entities/address.entity';
/**
 * A class representing a tenant data object
 */
export default class TenantEntity extends BaseEntity {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsObject()
  @IsOptional()
  address?: AddressEntity;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  floor?: string;
}
