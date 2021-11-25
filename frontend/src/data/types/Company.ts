import {CompanyItem} from '../../../../shared/schemas/CompanyItem';
import Joi from 'joi';
import {Address} from 'src/data/types/Address';
/**
 * A class representing a company data object
 */

export class Company {
  company_name: string|null
  language: string|null
  uid: string|null
  uuid: string|null
  person_name: string|null
  domicile_address: Address|null
  correspondence_address: Address|null
  phone: string|null
  email: string|null
  branch_structure: boolean|null
  document_upload_enabled: boolean|null
  documents: Array<File>|null

  constructor(company_name?: string, language?: string, uid?: string, uuid?: string, person_name?: string, domicile_address?: Address, correspondance_address?: Address,
              phone?: string, email?: string, branch_structure?: boolean, document_upload_enabled?: boolean, documents?: Array<File>) {

    this.company_name = company_name ?? null
    this.language = language ?? null
    this.uid = uid ?? null
    this.uuid = uuid ?? null
    this.person_name = person_name ?? null
    this.domicile_address = domicile_address ?? null
    this.correspondence_address = correspondance_address ?? null
    this.phone = phone ?? null
    this.email = email ?? null
    this.branch_structure = branch_structure ?? null
    this.document_upload_enabled = document_upload_enabled ?? null
    this.documents = documents ?? null
  }

  /**
   * Validates the company item to Joi schema
   */
  validate(): boolean{
    try{
      Joi.assert(this, CompanyItem)
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
   * @param {string} person_name
   * @param {Address} domicile_address
   * @param {Address} correspondance_address
   * @param {string} phone
   * @param {string} email
   * @param {boolean} branch_structure
   * @param {boolean} document_upload_enabled
   * @param {Array<File>} documents
   *
   */
  replace({company_name, language, uid, uuid, person_name, domicile_address, correspondance_address, phone, email, branch_structure, document_upload_enabled, documents}:
            {
              company_name: string, language: string, uid: string, uuid: string, person_name: string, domicile_address: Address, correspondance_address: Address,
              phone: string, email: string, branch_structure: boolean, document_upload_enabled: boolean, documents: Array<File>
            }): void {

    this.company_name = company_name
    this.language = language
    this.uid = uid
    this.uuid = uuid
    this.person_name = person_name
    this.domicile_address = domicile_address
    this.correspondence_address = correspondance_address
    this.phone = phone
    this.email = email
    this.branch_structure = branch_structure
    this.document_upload_enabled = document_upload_enabled
    this.documents = documents
  }
}
