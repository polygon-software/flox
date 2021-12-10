import {EMAIL_REGEX, PASSWORD_REGEX, URL_REGEX} from 'src/helpers/REGEX';

/**
 * This file contains rules that can be applied to input forms.
 */

/**
* Form field Rules
 */
const IS_EMAIL = (val: string): boolean => {
  return EMAIL_REGEX.test(val);
}

const IS_URL = (val: string): boolean => {
  return URL_REGEX.test(val)
}

const IS_VALID_STRING = (val: string): boolean => !!(val && val.length > 0)
const IS_VALID_INT = (val: string): boolean => !!(Number.parseInt(val))
const IS_VALID_NUMBER = (val: string): boolean => !!(Number.parseFloat(val))

const IS_VALID_PASSWORD = (val: string): boolean => {
  const result: boolean = PASSWORD_REGEX.test(val)
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

const IS_VALID_BIRTHDATE = (val: string): boolean => {
  console.log('TODO check', val, 'for birthday')
  // TODO
  return true
}

const IS_FUTURE_DATE = (val: Date): boolean => {
  return (new Date() <= new Date(val))
}

const IS_SMALLER_THAN = (val: number, other: number): boolean => {
  return val < other
}

const IS_LARGER_THAN = (val: number, other: number): boolean => {
  return val > other
}

const IS_SMALLER_THAN_OR_EQUAL = (val: number, other: number): boolean => {
  return val <= other
}

const IS_LARGER_THAN_OR_EQUAL = (val: number, other: number): boolean => {
  return val >= other
}

const IS_VALID_MIN_BET = (min: number, max: number, value: number): boolean => {
  return min <= value/20 && value % min === 0 && min < max//TODO Correct parameters for min bet calculation
}

const IS_VALID_MAX_BET = (max: number, min: number, value: number): boolean => {
  return max <= value/5 && value % max === 0 && max > min //TODO Correct parameters for max bet calculation
}

export {
  IS_EMAIL,
  IS_URL,
  IS_VALID_STRING,
  IS_VALID_INT,
  IS_VALID_NUMBER,
  IS_VALID_PASSWORD,
  IS_VALID_HOUSE_NUMBER,
  IS_VALID_ZIP,
  IS_VALID_BIRTHDATE,
  IS_FUTURE_DATE,
  IS_SMALLER_THAN,
  IS_LARGER_THAN,
  IS_LARGER_THAN_OR_EQUAL,
  IS_SMALLER_THAN_OR_EQUAL,
  IS_VALID_MIN_BET,
  IS_VALID_MAX_BET,
}
