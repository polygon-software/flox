import { IsOptional, IsString } from 'class-validator';

import CreateBillingInput from 'src/data/billing/dto/input/createBillingInput';
import BillingEntity from 'src/data/billing/entities/billingEntity';
import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';

/**
 * A class representing an input object for updating a billing data object
 */
export default class UpdateBillingInput extends CreateBillingInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateBillingInput
   * @param [uuid] - The uuid of the billing
   * @param [companyName] - The company name of the billing
   * @param [firstName] - The first name of the billing
   * @param [lastName] - The last name of the billing
   * @param [address] - The address of the billing
   * @param [email] - The email of the billing
   */
  constructor(
    companyName?: string,
    firstName?: string,
    lastName?: string,
    address?: UpdateAddressInput,
    email?: string,
    uuid?: string
  ) {
    super();
    this.uuid = uuid;
    this.companyName = companyName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.email = email;
  }

  /**
   * Transform BillingEntity to input
   * @param {BillingEntity} billing - The billing entity from the database
   * @returns {UpdateBillingInput} - The billing input for update
   */
  static fromBilling(billing?: BillingEntity): UpdateBillingInput {
    return new UpdateBillingInput(
      billing?.companyName,
      billing?.firstName,
      billing?.lastName,
      UpdateAddressInput.fromAddress(billing?.address),
      billing?.email,
      billing?.uuid
    );
  }
}
