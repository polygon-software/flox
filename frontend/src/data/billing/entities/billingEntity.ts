import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import AddressEntity from 'src/data/address/entities/address.entity';

/**
 * A class representing a billing data object
 */
export default class BillingEntity extends BaseEntity {
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
  address?: AddressEntity;

  @IsEmail()
  @IsOptional()
  email?: string;
}
