import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import AddressEntity from 'src/data/address/entities/address.entity';
import { FLOOR } from 'src/data/ENUM';

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

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(FLOOR)
  @IsOptional()
  floorType?: FLOOR;

  @IsNumber()
  @IsOptional()
  floorNumber?: number;
}
