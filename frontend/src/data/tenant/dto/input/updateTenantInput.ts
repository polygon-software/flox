import { IsOptional, IsString } from 'class-validator';

import CreateTenantInput from 'src/data/tenant/dto/input/createTenantInput';
import TenantEntity from 'src/data/tenant/entities/tenantEntity';
import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';

/**
 * A class representing an input object for updating a tenant data object
 */
export default class UpdateTenantInput extends CreateTenantInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateTenantInput
   * @param [uuid] - The uuid of the tenant
   * @param [firstName] - The first name of the tenant
   * @param [lastName] - The last name of the tenant
   * @param [address] - The address of the tenant
   * @param [phoneNumber] - The phone number of the tenant
   * @param [email] - The email of the tenant
   * @param [floor] - The floor type of the tenant's apartment
   */
  constructor(
    firstName?: string,
    lastName?: string,
    address?: UpdateAddressInput,
    phoneNumber?: string,
    email?: string,
    floor?: string,
    uuid?: string
  ) {
    super();
    this.uuid = uuid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.floor = floor;
  }

  /**
   * Transform TenantEntity to input
   * @param tenant - The tenant entity from the database
   * @returns - The tenant input for update
   */
  static fromTenant(tenant?: TenantEntity): UpdateTenantInput {
    return new UpdateTenantInput(
      tenant?.firstName,
      tenant?.lastName,
      UpdateAddressInput.fromAddress(tenant?.address),
      tenant?.phoneNumber,
      tenant?.email,
      tenant?.floor,
      tenant?.uuid
    );
  }
}
