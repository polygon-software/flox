import {EMAIL_REGEX, PASSWORD_REGEX} from 'src/helpers/REGEX';
import {isEmpty} from 'lodash';

/**
 * This file contains rules that can be applied to input forms.
 */

/**
* Form field Rules
 */
const IS_EMAIL = (val: string):boolean => {
  return EMAIL_REGEX.test(val)
}
const IS_VALID_STRING = (val: string): boolean => {
  return !isEmpty(val) && val.length > 0
}

const IS_VALID_PASSWORD = (val: string): boolean => {
  return PASSWORD_REGEX.test(val)
}

const IS_VALID_HOUSE_NUMBER = (val: string): boolean => {
  //TODO: Add check for house number
  return Number.isInteger(parseInt(val, 10))
}

const IS_VALID_ZIP = (val: string): boolean => {
  //TODO: Add check for ZIP Code
  return Number.isInteger(parseInt(val, 10))
}

export {IS_EMAIL, IS_VALID_STRING, IS_VALID_PASSWORD, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP}
