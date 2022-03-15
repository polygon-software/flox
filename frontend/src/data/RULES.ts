import { EMAIL_REGEX, PASSWORD_REGEX, URL_REGEX } from 'src/helpers/REGEX';
import { parseDate } from 'src/helpers/format-helpers';
import { calculateAge } from 'src/helpers/date-helpers';

/**
 * This file contains rules that can be applied to input forms.
 */

const IS_EMAIL = (val: string): boolean => {
  return EMAIL_REGEX.test(val);
};

const IS_URL = (val: string): boolean => {
  return URL_REGEX.test(val);
};

const IS_VALID_STRING = (val: string): boolean => !!(val && val.length > 0);
const IS_VALID_INT = (val: string): boolean => !!Number.parseInt(val);
const IS_VALID_NUMBER = (val: string): boolean => !!Number.parseFloat(val);

const IS_VALID_PASSWORD = (val: string): boolean => {
  return PASSWORD_REGEX.test(val);
};

const IS_VALID_HOUSE_NUMBER = (val: string): boolean => {
  return Number.isInteger(parseInt(val, 10));
};

const IS_VALID_ZIP = (val: string): boolean => {
  return Number.isInteger(parseInt(val, 10));
};

const IS_VALID_BIRTHDATE = (val: string): boolean => {
  const birthDate = new Date(val);
  const age = calculateAge(birthDate);
  return age >= 18;
};

const IS_FUTURE_DATE = (val: string): boolean => {
  return new Date() <= parseDate(val);
};

const IS_SMALLER_THAN = (val: number, other: number): boolean => {
  return val < other;
};

const IS_LARGER_THAN = (val: number, other: number): boolean => {
  return val > other;
};

const IS_SMALLER_THAN_OR_EQUAL = (val: number, other: number): boolean => {
  return val <= other;
};

const IS_LARGER_THAN_OR_EQUAL = (val: number, other: number): boolean => {
  return val >= other;
};

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
};
