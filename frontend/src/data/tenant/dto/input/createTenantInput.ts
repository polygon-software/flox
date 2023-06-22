import { IsObject, IsOptional, IsString } from 'class-validator';

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

  @IsString()
  @IsOptional()
  floor?: string;
}
