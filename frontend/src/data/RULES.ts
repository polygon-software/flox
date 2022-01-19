import {EMAIL_REGEX, PASSWORD_REGEX} from 'src/helpers/REGEX';
import {isEmpty} from 'lodash';

/**
 * This file contains rules that can be applied to input forms.
 */

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

const IS_VALID_ZIP = (val: string): boolean => {
  //TODO: Add check for ZIP Code
  return Number.isInteger(parseInt(val, 10))
}

// Checks whether a selection is contained in a list of options
const IS_VALID_OPTION = (val: unknown|Record<string, unknown>, options: unknown[]): boolean => {

  const result = options.includes(val) || (options as Record<string, unknown>[]).some((option) => {
    return option.value === val || option.value === (val as Record<string, unknown>)?.value
  })

  console.log('check', val, 'for options', options, ':', result)

  return result
}

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


export {
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
  IS_VALID_PAST_YEAR
}
