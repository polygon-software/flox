import {AddressItem} from '../../../../shared/schemas/AddressItem';
import Joi from 'joi';

/**
 * A class representing an address
 * TODO: Joi Validation?
 */

export class Address{
  street: string|null
  number: string|null
  city: string|null
  zip_code: string|null

  constructor(street?: string, number?: string, city?: string, zip_code?: string) {
    this.street = street ?? null
    this.number = number ?? null
    this.city = city ?? null
    this.zip_code = zip_code ?? null
  }

  /**
   * Validates the Address to Joi schema
   */
  validate(): boolean{
    try{
      Joi.assert(this, AddressItem)
      return true;
    } catch (e) { return false }
  }

}
