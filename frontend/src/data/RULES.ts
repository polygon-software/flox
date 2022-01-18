import {EMAIL_REGEX, PASSWORD_REGEX} from 'src/helpers/REGEX';
import {isEmpty} from 'lodash';

/**
 * This file contains rules that can be applied to input forms.
 */

const IS_VALID_NUMBER = (val: number|string): boolean => {
  if(typeof val === 'number'){
    return true;
  }

  return !!parseInt(val)
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
  let value = val

  // If option was picked from an object, use inner 'value'
  if(!!val && (val as Record<string, unknown>).value){
    value = (val as Record<string, unknown>).value
  }
  return options.includes(value);
}

const IS_VALID_FULL_NAME = (val: Record<string, string>): boolean => {
  return !isEmpty(val) && IS_VALID_STRING(val.first_name) && IS_VALID_STRING(val.last_name)
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
  IS_VALID_FULL_NAME
}
