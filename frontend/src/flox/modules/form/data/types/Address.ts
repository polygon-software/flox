import BaseEntity from './BaseEntity';

/**
 * A class representing an address data object
 */
export default class Address extends BaseEntity {
  street: string;

  number: string;

  city: string;

  zipCode: string;

  additionalAddress: string | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    street: string,
    number: string,
    city: string,
    zipCode: string,
    additionalAddress: string | null
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
    this.street = street;
    this.number = number;
    this.city = city;
    this.zipCode = zipCode;
    this.additionalAddress = additionalAddress;
  }
}
