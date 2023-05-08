import { IsOptional, IsString } from 'class-validator';

import CreateAddressInput from 'src/data/address/input/dto/createAddressInput';

/**
 * A class representing an input object for updating an address data object
 */
export default class UpdateAddressInput extends CreateAddressInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
