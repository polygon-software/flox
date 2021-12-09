import {EMAIL_REGEX, PASSWORD_REGEX} from 'src/helpers/REGEX';

/**
 * This file contains rules that can be applied to input forms.
 */

/**
* Form field Rules
 */
const IS_EMAIL = (val: string): boolean => {
  const result: boolean =  EMAIL_REGEX.test(val)
  return result;
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

export {
  IS_EMAIL,
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
  IS_SMALLER_THAN_OR_EQUAL
}
