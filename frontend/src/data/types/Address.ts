import Joi, { Schema } from 'joi';
import { i18n } from 'boot/i18n';
import { AddressItem } from '../../../schemas/AddressItem';

/**
 * A class representing an address
 */
export class Address {
  street: string | null;
  number: string | null;
  city: string | null;
  zipCode: string | null;

  /**
   * Constructor
   * @param {string} street - street
   * @param {string} number - number
   * @param {string} city - city
   * @param {string} zipCode - zip code
   */
  constructor(
    street?: string,
    number?: string,
    city?: string,
    zipCode?: string
  ) {
    this.street = street ?? null;
    this.number = number ?? null;
    this.city = city ?? null;
    this.zipCode = zipCode ?? null;
  }

  /**
   * Validates the address to Joi schema
   * @returns {boolean} whether the address fits the schema
   */
  validate(): boolean {
    try {
      Joi.assert(this, AddressItem as unknown as Schema);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Replaces an address's content
   * @param {string} street - street
   * @param {string} number - number
   * @param {string} city - city
   * @param {string} zipCode - zip code
   * @returns {void}
   */
  replace({
    street,
    number,
    city,
    zipCode,
  }: {
    street: string;
    number: string;
    city: string;
    zipCode: string;
  }): void {
    this.street = street;
    this.number = number;
    this.city = city;
    this.zipCode = zipCode;
  }

  /**
   * Returns a string representation of the address.
   * @returns {void}
   */
  prettyString(): string {
    if (
      [this.street, this.number, this.city, this.zipCode].every(
        (val) => val !== null
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${this.street} ${this.number}, ${this.zipCode} ${this.city}`;
    }
    return i18n.global.t('errors.missing_attributes');
  }
}
