import Joi, {Schema} from 'joi';
import {i18n} from 'boot/i18n';
import {ROLE} from 'src/data/ENUM/ENUM';
import {UserItem} from '../../../../shared/schemas/UserItem';

/**
 * A class representing an user
 */
export class User{
  uuid: string
  fk: string|null
  role: ROLE|null

  /**
   * Constructor
   * @param {string} uuid - uuid
   * @param {string} fk - uuid of specific user
   * @param {ROLE} role - role of user
   */
  constructor(uuid:string, fk?: string, role?: ROLE) {
    this.uuid = uuid
    this.fk = fk ?? null
    this.role = role ?? null
  }

  /**
   * Validates the address to Joi schema
   * @returns {boolean} whether the address fits the schema
   */
  validate(): boolean{
    try {
      Joi.assert(this, UserItem as Schema<any>)
      return true;
    } catch (e) {
      return false
    }
  }

  /**
   * Replaces an address's content
   * @param {string} fk - uuid of specific user
   * @param {ROLE} role - role of user
   * @returns {void}
   */
  replace({fk, role, uuid}: {fk: string, role:ROLE, uuid:string}): void{
    this.fk = fk
    this.role = role
    this.uuid = uuid
  }

  /**
   * Returns a string representation of the address.
   * @returns {void}
   */
  prettyString(): string {
    if ([this.fk, this.role].every((val) => val !== null)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${this.role}: ${this.fk}`
    }
    return i18n.global.t('errors.missing_attributes')
  }

}
