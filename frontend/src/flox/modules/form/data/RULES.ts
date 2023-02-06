import { isValid } from 'date-fns';
import { date } from 'quasar';

import {
  EMAIL_REGEX,
  IBAN_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  TIME_REGEX,
  UID_REGEX,
  URL_REGEX,
  ZIP_REGEX,
} from 'src/flox/modules/form/data/REGEX';

/**
 * This file contains rules that can be applied to input forms.
 */

const IS_EMAIL = (val: string): boolean => {
  return EMAIL_REGEX.test(val);
};

const IS_VALID_HOUSE_NUMBER = (val: string): boolean => {
  const number = parseInt(val, 10);
  return Number.isInteger(number) && number > 0;
};

const IS_VALID_IBAN = (val: string): boolean => {
  return IBAN_REGEX.test(val);
};

const IS_NOT_NULL = (val: unknown): boolean => {
  return val !== null && val !== undefined;
};

const IS_VALID_PASSWORD = (val: string): boolean => {
  return PASSWORD_REGEX.test(val);
};

const IS_VALID_PHONE_NUMBER = (val: string): boolean => {
  return PHONE_NUMBER_REGEX.test(val);
};

const IS_VALID_STRING = (val: string | undefined): boolean =>
  !!(val && val.length > 0);


const IS_VALID_ZIP = (val: string): boolean => {
  return ZIP_REGEX.test(val);
};

const IS_VALID_TIME = (val: string): boolean => {
  return TIME_REGEX.test(val);
};

const IS_VALID_FUTURE_DATE = (val: Date): boolean => {
  return (
    isValid(val) &&
    val.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) &&
    val.getFullYear() < new Date().getFullYear() + 100
  );
};

const IS_VALID_DATE = (val: Date): boolean => {
  return isValid(val) && val.getFullYear() > 1900 && val.getFullYear() < 2100;
};

const IS_VALID_DATE_STRING = (val: string, format: string): boolean => {
  if (!val) {
    return false;
  }
  // For date strings, we additionally check that the year makes sense (since extractDate will
  // implicitly convert 05-06-0001 to 05-06-1901
  const yearIndex = format.toLowerCase().indexOf('yyyy');

  const monthIndex = format.toLowerCase().indexOf('mm');

  // If year is present in format, sanity-check it
  if (yearIndex > -1) {
    const yearNumber = Number.parseInt(
      val.substring(yearIndex, yearIndex + 4),
      10
    );
    // If year too low, fail check
    if (yearNumber < 1900) {
      return false;
    }
  }

  // If month is present in format, sanity-check it
  const monthNumber = Number.parseInt(
    val.substring(monthIndex, monthIndex + 2),
    10
  );
  // Month must be in range [1, 12]
  if (monthNumber < 1 || monthNumber > 12) {
    return false;
  }

  return IS_VALID_DATE(date.extractDate(val, format));
};

const IS_VALID_NUMBER = (val: number): boolean => !!val;

const IS_VALID_POSITIVE_NUMBER = (val: number): boolean => {
  return val !== null && val >= 0;
};

const IS_VALID_URL = (val: string): boolean => {
  return URL_REGEX.test(val);
};

export {
  IS_EMAIL,
  IS_VALID_HOUSE_NUMBER,
  IS_VALID_IBAN,
  IS_NOT_NULL,
  IS_VALID_PASSWORD,
  IS_VALID_PHONE_NUMBER,
  IS_VALID_STRING,
  IS_VALID_UID,
  IS_VALID_ZIP,
  IS_VALID_TIME,
  IS_VALID_DATE_STRING,
  IS_VALID_FUTURE_DATE,
  IS_VALID_DATE,
  IS_VALID_NUMBER,
  IS_VALID_POSITIVE_NUMBER,
  IS_VALID_URL,
};
