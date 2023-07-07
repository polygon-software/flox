import { IsOptional, IsString } from 'class-validator';

import ProtocolEntity from '../entities/protocolEntity';

import CreateProtocolInput from './createProtocolInput';

/**
 * A class representing an input object for updating a protocol data object
 */
export default class UpdateProtocolInput extends CreateProtocolInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateProtocolInput
   * @param [date] - The date of the protocol
   * @param [articleNumber] - The article number of the protocol
   * @param [label] - The label of the protocol
   * @param [description] - The description of the protocol
   * @param [unit] - The unit of the protocol
   * @param [amount] - The amount of units in the protocol
   * @param [price] - The price of units in the protocol
   * @param [discount] - The discount for the protocol
   * @param [sum] - The sum of the total cost in the protocol
   * @param [uuid] - The uuid of the protocol
   */
  constructor(
    date?: Date,
    articleNumber?: string,
    label?: string,
    description?: string,
    unit?: string,
    amount?: string,
    price?: string,
    discount?: string,
    sum?: string,
    uuid?: string
  ) {
    super();
    this.date = date;
    this.articleNumber = articleNumber;
    this.label = label;
    this.description = description;
    this.unit = unit;
    this.amount = amount;
    this.price = price;
    this.discount = discount;
    this.sum = sum;
    this.uuid = uuid;
  }

  /**
   * Transform ProtocolEntity to input
   * @param {ProtocolEntity} protocol - The protocol entity from the database
   * @returns {UpdateProtocolInput} - The protocol input for update
   */
  static fromProtocol(protocol?: ProtocolEntity): UpdateProtocolInput {
    return new UpdateProtocolInput(
      protocol?.date,
      protocol?.articleNumber,
      protocol?.label,
      protocol?.description,
      protocol?.unit,
      protocol?.amount,
      protocol?.price,
      protocol?.discount,
      protocol?.sum,
      protocol?.uuid
    );
  }
}
