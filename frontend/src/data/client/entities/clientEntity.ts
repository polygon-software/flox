import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import { LEGAL_FORM } from 'src/data/ENUM';
import AddressEntity from 'src/data/address/entities/address.entity';

/**
 * A class representing a client data object
 */
export default class ClientEntity extends BaseEntity {
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
  address?: AddressEntity;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
