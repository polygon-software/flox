import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import { LEGAL_FORM } from 'src/data/ENUM';
import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';

/**
 * A class representing an input object for creating a client data object
 */
export default class CreateClientInput {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEnum(LEGAL_FORM)
  @IsOptional()
  companyLegalForm?: LEGAL_FORM;

  @IsObject()
  @IsOptional()
  address?: UpdateAddressInput;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
