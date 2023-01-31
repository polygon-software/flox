import Address from './Address';

/**
 * A class representing a create address data object
 */
export default class AddressInput {
  street?: string;

  number?: string;

  city?: string;

  zipCode?: string;

  uuid?: string;

  additionalAddress?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    street?: string,
    number?: string,
    city?: string,
    zipCode?: string,
    uuid?: string,
    additionalAddress?: string
  ) {
    this.street = street;
    this.number = number;
    this.city = city;
    this.zipCode = zipCode;
    this.uuid = uuid;
    this.additionalAddress = additionalAddress;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    return !!this.street && !!this.number && !!this.city && !!this.zipCode;
  }

  /**
   * create Address Input from Address
   * @param address - db address
   * @param [omitUuid] - whether to not include the UUID
   * @returns - res
   */
  static fromAddress(address: Address, omitUuid = false): AddressInput {
    return new AddressInput(
      address.street,
      address.number,
      address.city,
      address.zipCode,
      omitUuid ? undefined : address.uuid,
      address.additionalAddress ?? undefined
    );
  }
}
