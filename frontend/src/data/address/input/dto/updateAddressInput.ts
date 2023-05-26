import { IsOptional, IsString } from 'class-validator';

import CreateAddressInput from 'src/data/address/input/dto/createAddressInput';
import AddressEntity from 'src/data/address/entities/address.entity';

/**
 * A class representing an input object for updating an address data object
 */
export default class UpdateAddressInput extends CreateAddressInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateAddressInput
   * @param [uuid] - The uuid of the address
   * @param [street] - The street of the address
   * @param [number] - The number of the address
   * @param [city] - The city of the address
   * @param [zipCode] - The zip code of the address
   * @param [additionalAddress] - Additional address details
   */
  constructor(
    street?: string,
    number?: string,
    city?: string,
    zipCode?: number,
    additionalAddress?: string,
    uuid?: string
  ) {
    super();
    this.street = street;
    this.number = number;
    this.city = city;
    this.zipCode = zipCode;
    this.additionalAddress = additionalAddress;
    this.uuid = uuid;
  }

  /**
   * Transform AddressEntity to input
   * @param [address] - Address entitiy from db
   * @returns - The address input for update
   */
  static fromAddress(address?: AddressEntity): UpdateAddressInput {
    if (address) {
      return new UpdateAddressInput(
        address.street,
        address.number,
        address.city,
        address.zipCode,
        address.additionalAddress,
        address.uuid
      );
    }
    return new UpdateAddressInput();
  }
}
