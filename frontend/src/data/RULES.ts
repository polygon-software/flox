import {EMAIL_REGEX, PASSWORD_REGEX} from 'src/helpers/REGEX';
import {isEmpty} from 'lodash';
import {date} from 'quasar';

/**
 * This file contains rules that can be applied to input forms.
 */



const IS_VALID_STRING = (val: string): boolean => {
  return !isEmpty(val) && val.length > 0
}

const IS_VALID_DATE = (val: Date): boolean => {
  return !isEmpty(val)
}

const IS_VALID_PASSWORD = (val: string): boolean => {
  const result: boolean = PASSWORD_REGEX.test(val)
  return result;
}

const IS_VALID_EMAIL = (val: string): boolean => {
  const result: boolean =  EMAIL_REGEX.test(val)
  return result;
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
const IS_VALID_OPTION = (val: unknown, options: unknown[]): boolean => {
  return options.includes(val);
}

export {IS_VALID_EMAIL, IS_VALID_DATE, IS_VALID_STRING, IS_VALID_PASSWORD, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP, IS_VALID_OPTION}
