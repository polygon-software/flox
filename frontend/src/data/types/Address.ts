import {AddressItem} from '../../../../shared/schemas/AddressItem';
import Joi from 'joi';
import {i18n} from 'boot/i18n';

/**
 * A class representing an address
 */
export class Address{
  street: string|null
  number: string|null
  city: string|null
  zip_code: string|null

  /**
   * Constructor
   * @param {string} street - street
   * @param {string} number - number
   * @param {string} city - city
   * @param {string} zip_code - zip code
   */
  constructor(street?: string, number?: string, city?: string, zip_code?: string) {
    this.street = street ?? null
    this.number = number ?? null
    this.city = city ?? null
    this.zip_code = zip_code ?? null
  }

  /**
   * Validates the address to Joi schema
   * @returns {boolean} whether the address fits the schema
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
   * @param {string} street - street
   * @param {string} number - number
   * @param {string} city - city
   * @param {string} zip_code - zip code
   * @returns {void}
   */
  replace({street, number, city, zip_code}: {street: string, number: string, city: string, zip_code: string}): void{
    this.street = street
    this.number = number
    this.city = city
    this.zip_code = zip_code
  }

  /**
   * Returns a string representation of the address.
   * @returns {void}
   */
  prettyString(): string {
    if ([this.street, this.number, this.city, this.zip_code].every((val) => val !== null)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${this.street} ${this.number}, ${this.zip_code} ${this.city}`
    }
    return i18n.global.t('errors.missing_attributes')
  }

}
