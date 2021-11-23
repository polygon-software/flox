import {AddressItem} from '../../../../shared/schemas/AddressItem';
import Joi from 'joi';

/**
 * A class representing an address
 */

export class Address{
  street: string|null
  number: string|null
  city: string|null
  zip_code: string|null
  country: string|null

  constructor(street?: string, number?: string, city?: string, zip_code?: string, country?: string) {
    this.street = street ?? null
    this.number = number ?? null
    this.city = city ?? null
    this.zip_code = zip_code ?? null
    this.country = country ?? null
  }

  /**
   * Validates the address to Joi schema
   */
  validate(): boolean{
    try {
      Joi.assert(this, AddressItem)
      return true;
    } catch (e) {
      return false
    }
  }

  /**
   * Replaces an address's content
   * @param {string} street
   * @param {string} number
   * @param {string} city
   * @param {string} zip_code
   * @param {string} country
   */
  replace({street, number, city, zip_code, country}: {street: string, number: string, city: string, zip_code: string, country: string}): void{
    this.street = street
    this.number = number
    this.city = city
    this.zip_code = zip_code
    this.country = country
  }

  /**
   * Returns a string representation of the address.
   */
  prettyString(): string {
    if ([this.street, this.number, this.city, this.zip_code, this.country].every((val) => val !== null)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${this.street} ${this.number}, ${this.zip_code} ${this.city} ${this.country}`
    }
    return 'Missing attributes'
  }

}
