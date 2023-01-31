import Address from './Address';
import BaseEntity from './BaseEntity';

/**
 * A class representing a banking information data object
 */
export default class BankInfo extends BaseEntity {
  iban: string;

  bankName: string;

  address: Address;

  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    iban: string,
    bankName: string,
    address: Address
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
    this.iban = iban;
    this.bankName = bankName;
    this.address = address;
  }
}
