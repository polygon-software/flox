import AddressInput from './AddressInput';
import BankInfo from './BankInfo';

/**
 * A class representing a create banking information data object
 */
export default class BankInfoInput {
  iban?: string;

  bankName?: string;

  address?: AddressInput;

  uuid?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    iban?: string,
    bankName?: string,
    address?: AddressInput,
    uuid?: string
  ) {
    this.iban = iban;
    this.bankName = bankName;
    this.address = address;
    this.uuid = uuid;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    return !!this.iban && !!this.bankName && !!this.address?.isComplete();
  }

  /**
   * Transform db to input
   * @param bankInfo - from db
   * @param [omitUuid] - whether to not include the UUID
   * @returns - input
   */
  static fromBankInfo(bankInfo: BankInfo, omitUuid = false): BankInfoInput {
    return new BankInfoInput(
      bankInfo.iban,
      bankInfo.bankName,
      AddressInput.fromAddress(bankInfo.address, omitUuid),
      omitUuid ? undefined : bankInfo.uuid
    );
  }
}
