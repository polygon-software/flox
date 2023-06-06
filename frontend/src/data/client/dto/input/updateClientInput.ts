import { IsOptional, IsString } from 'class-validator';

import CreateClientInput from 'src/data/client/dto/input/createClientInput';
import { LEGAL_FORM } from 'src/data/ENUM';
import UpdateAddressInput from 'src/data/address/input/dto/updateAddressInput';
import ClientEntity from 'src/data/client/entities/clientEntity';

/**
 * A class representing an input object for updating a client data object
 */
export default class UpdateClientInput extends CreateClientInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateClientInput
   * @param [uuid] - The uuid of the client
   * @param [firstName] - The first name of the client
   * @param [lastName] - The last name of the client
   * @param [companyName] - The name of the company
   * @param [companyLegalForm] - The legal form of the company
   * @param [address] - The address of the client
   * @param [phoneNumber] - The phone number of the client
   * @param [email] - The email of the client
   */
  constructor(
    firstName?: string,
    lastName?: string,
    companyName?: string,
    companyLegalForm?: LEGAL_FORM,
    address?: UpdateAddressInput,
    phoneNumber?: string,
    email?: string,
    uuid?: string
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.companyName = companyName;
    this.companyLegalForm = companyLegalForm;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.uuid = uuid;
  }

  /**
   * Transform ClientEntity to input
   * @param [client] - The client entity from db
   * @returns - The client input for update
   */
  static fromClient(client?: ClientEntity): UpdateClientInput {
    return new UpdateClientInput(
      client?.firstName,
      client?.lastName,
      client?.companyName,
      client?.companyLegalForm,
      UpdateAddressInput.fromAddress(client?.address),
      client?.phoneNumber,
      client?.email,
      client?.uuid
    );
  }
}
