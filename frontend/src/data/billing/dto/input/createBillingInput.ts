import { IsObject, IsOptional, IsString } from 'class-validator';

import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';

/**
 * A class representing an input object for creating a billing data object
 */
export default class CreateBillingInput {
  @IsString()
  @IsOptional()
  companyName?: string;

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
  email?: string;
}
