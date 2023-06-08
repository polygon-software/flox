import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { FLOOR } from 'src/data/ENUM';
import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';

/**
 * A class representing an input object for creating a tenant data object
 */
export default class CreateTenantInput {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsObject()
  @IsOptional()
  address?: UpdateAddressInput;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(FLOOR)
  @IsOptional()
  floorType?: FLOOR;

  @IsNumber()
  @IsOptional()
  floorNumber?: number;
}
