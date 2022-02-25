import {EMAIL_REGEX, PASSWORD_REGEX} from 'src/helpers/REGEX';
import {isEmpty} from 'lodash';
import {getAuthToken} from 'src/helpers/cookie-helpers';
import axios from 'axios';

/**
 * This file contains rules that can be applied to input forms.
 */

const IS_NOT_NULL = (val: unknown): boolean => {
  return val !== null && val !== undefined
}

const IS_VALID_NUMBER = (val: number|string): boolean => {
  if(typeof val === 'number'){
    return true;
  }

  return !!parseInt(val) || parseInt(val) === 0
}

const IS_VALID_STRING = (val: string): boolean => {
  return !isEmpty(val) && val.length > 0
}

const IS_VALID_DATE = (val: Date|string): boolean => {
  let actualDate

  if(typeof val === 'string'){
    actualDate = new Date(val)
  } else{
    actualDate = val
  }

  try{
    void actualDate.getMilliseconds()
    return true
  } catch (e){
    return false
  }
}

const IS_VALID_PASSWORD = (val: string): boolean => {
  return PASSWORD_REGEX.test(val)
}

const IS_VALID_EMAIL = (val: string): boolean => {
  return EMAIL_REGEX.test(val)
}

const IS_VALID_HOUSE_NUMBER = (val: string): boolean => {
  //TODO: Add check for house number
  return Number.isInteger(parseInt(val, 10))
}

const IS_VALID_ZIP = async (val: string, strict: boolean): Promise<boolean> => {
  if(!strict){
    return Number.isInteger(parseInt(val, 10))
  }

  return isZipCodeValid(val)
}


/**
 * Determines whether the currently entered zip code is valid
 * @param {string} zipCode - the zip code to validate
 * @returns {Promise<boolean>} - whether it's valid
 */
async function isZipCodeValid(zipCode: string){
  // Ensure user has token
  const token: string|null = getAuthToken();

  if(!zipCode || !token){
    return false
  }

  const headers = {
    Authorization: `Bearer ${token}`
  }
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''
  const url = `${baseUrl}/isZipCodeValid?zipCode=${zipCode}`

  // Get value multiplier from backend
  const isValidRequest = await axios.get(url, {headers});
  return isValidRequest.data as boolean;
}

/**
 * Checks whether a selection is contained in a list of options
 * @param {unknown|Record<string,unknown>} val - chosen option
 * @param {unknown[]} options - valid options
 * @constructor
 */
const IS_VALID_OPTION = (val: unknown|Record<string, unknown>, options: unknown[]): boolean => {
  return options.includes(val) || (options as Record<string, unknown>[]).some((option) => {
    return option.value === val || option.value === (val as Record<string, unknown>)?.value
  })
}

/**
 * Checks whether a given full name is complete (first and last name)
 * @param {Record<string, string>} val - entered full name
 * @constructor
 */
const IS_VALID_FULL_NAME = (val: Record<string, string>): boolean => {
  return !isEmpty(val) && IS_VALID_STRING(val.firstName) && IS_VALID_STRING(val.lastName)
}

/**
 * Checks whether a given year is valid (after 1900)
 * @param {string|number} val - the year
 * @constructor
 */
const IS_VALID_YEAR = (val: string|number): boolean => {
  let value = val

  if(typeof val === 'string'){
    value = parseInt(val)
  }
  return value > 1900;
}

/**
 * Checks whether a given year is valid (between 1900 and not in the future)
 * @param {string|number} val - the year
 * @constructor
 */
const IS_VALID_PAST_YEAR = (val: string|number): boolean => {
  let value = val

  if(typeof val === 'string'){
    value = parseInt(val)
  }

  return IS_VALID_YEAR(value) && value <= new Date().getFullYear();
}

/**
 * Checks whether mortgage partitioning is valid
 * @param {Record<string, number|Date>[]} val - mortgage partitions
 * @constructor
 */
const IS_VALID_MORTGAGE = (val: Record<string, number|Date>[]): boolean => {
  return val.every((partition) => {
    return partition.amount && partition.amount > 0 && partition.date
  })
}

const IS_VALID_BUILDING_LEASE = (val: Record<string, unknown>): boolean => {
  return !val.hasBuildingLease || (val.expirationDate !== null && val.interest !== null)
}

const IS_VALID_RENOVATION = (val: Record<string, unknown>): boolean => {
  return !val.hasRenovation || (val.renovationYear !== null && val.renovationPrice !== null)
}

const IS_VALID_AMORTISATION = (val: Record<string, unknown>): boolean => {
  return !val.hasAmortisation || val.amortisationAmount !== null
}

const IS_VALID_INCOME = (val: number[]): boolean => {
  return val.length > 0 && val.every((income) => income > 0)
}

export {
  IS_NOT_NULL,
  IS_VALID_NUMBER,
  IS_VALID_EMAIL,
  IS_VALID_DATE,
  IS_VALID_STRING,
  IS_VALID_PASSWORD,
  IS_VALID_HOUSE_NUMBER,
  IS_VALID_ZIP,
  IS_VALID_OPTION,
  IS_VALID_FULL_NAME,
  IS_VALID_YEAR,
  IS_VALID_PAST_YEAR,
  IS_VALID_MORTGAGE,
  IS_VALID_BUILDING_LEASE,
  IS_VALID_RENOVATION,
  IS_VALID_AMORTISATION,
  IS_VALID_INCOME
}
