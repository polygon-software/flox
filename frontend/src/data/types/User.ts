import Joi, {Schema} from 'joi';
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
   * @returns {boolean} whether the user fits the schema
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
   * Replaces an user's content
   * @param {string} fk - uuid of specific user
   * @param {ROLE} role - role of user
   * @param {string} uuid - user of user
   * @returns {void}
   */
  replace({fk, role, uuid}: {fk: string, role:ROLE, uuid:string}): void{
    this.fk = fk
    this.role = role
    this.uuid = uuid
  }

}
