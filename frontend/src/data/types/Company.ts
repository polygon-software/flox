import {CompanyItem} from '../../../../shared/schemas/CompanyItem';
import Joi, {Schema} from 'joi';
import {Address} from 'src/data/types/Address';
import {CREATION_STATE} from 'src/data/ENUM/ENUM';

/**
 * A class representing a company data object
 */
export class Company {
  company_name: string|null
  language: string|null
  uid: string|null
  uuid: string|null
  first_name: string|null
  last_name: string|null
  domicile_address: Address|null
  correspondence_address: Address|null
  phone: string|null
  email: string|null
  branch_structure: boolean|null
  creation_state: CREATION_STATE
  documents: Array<Record<string, unknown>>|null
  readable_id: string|null

  /**
   * Constructor
   * @param company_name
   * @param language
   * @param uid
   * @param uuid
   * @param first_name
   * @param last_name
   * @param domicile_address
   * @param correspondance_address
   * @param phone
   * @param email
   * @param branch_structure
   * @param creation_state
   * @param documents
   * @param readable_id
   */
  // eslint-disable-next-line require-jsdoc
  constructor(company_name?: string, language?: string, uid?: string, uuid?: string, first_name?: string, last_name?: string, domicile_address?: Address, correspondance_address?: Address,
              phone?: string, email?: string, branch_structure?: boolean, creation_state?: CREATION_STATE, documents?: Array<Record<string, unknown>>, readable_id?: string) {
    this.company_name = company_name ?? null
    this.language = language ?? null
    this.uid = uid ?? null
    this.uuid = uuid ?? null
    this.first_name = first_name ?? null
    this.last_name = last_name ?? null
    this.domicile_address = domicile_address ?? null
    this.correspondence_address = correspondance_address ?? null
    this.phone = phone ?? null
    this.email = email ?? null
    this.branch_structure = branch_structure ?? null
    this.creation_state = creation_state ?? CREATION_STATE.APPLIED
    this.documents = documents ?? null
    this.readable_id = readable_id ?? null
  }

  /**
   * Validates the company item to Joi schema
   * @returns {boolean} - whether it's valid
   */
  validate(): boolean{
    try{
      Joi.assert(this, CompanyItem as Schema<any>)
      return true;
    } catch (e) {
      return false
    }
  }

  /**
   * Replaces an company's content
   * @param {string} company_name
   * @param {string} language
   * @param {string} uid
   * @param {string} uuid
   * @param {string} first_name
   * @param {string} last_name
   * @param {Address} domicile_address
   * @param {Address} correspondance_address
   * @param {string} phone
   * @param {string} email
   * @param {boolean} branch_structure
   * @param {boolean} document_upload_enabled
   * @param {Array<File>} documents
   * @returns {void}
   */
  // eslint-disable-next-line require-jsdoc
  replace({company_name, language, uid, uuid, first_name, last_name, domicile_address, correspondance_address, phone, email, branch_structure, creation_state, documents}:
            {
              company_name: string, language: string, uid: string, uuid: string, first_name: string, last_name: string, domicile_address: Address, correspondance_address: Address,
              phone: string, email: string, branch_structure: boolean, creation_state: CREATION_STATE, documents: Array<Record<string, unknown>>
            }): void {

    this.company_name = company_name
    this.language = language
    this.uid = uid
    this.uuid = uuid
    this.first_name = first_name
    this.last_name = last_name
    this.domicile_address = domicile_address
    this.correspondence_address = correspondance_address
    this.phone = phone
    this.email = email
    this.branch_structure = branch_structure
    this.creation_state = creation_state
    this.documents = documents
  }
}