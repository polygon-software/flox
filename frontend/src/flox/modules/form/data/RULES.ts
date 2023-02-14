import { isValid } from 'date-fns';
import { date } from 'quasar';
import {
  isDate,
  isEmail,
  isInt,
  isNotEmpty,
  isPhoneNumber,
  isPositive,
  isString,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js';

import { i18n } from 'boot/i18n';

import { classValidatorRule } from '../helpers/validation-helpers';

import {
  PASSWORD_REGEX,
  TIME_REGEX,
  VERIFICATION_CODE_REGEX,
  ZIP_REGEX,
} from './REGEX';

/**
 * This file contains rules that can be applied to input forms.
 */
const IS_EMAIL = classValidatorRule(
  isEmail,
  i18n.global.t('errors.invalid_email')
);

const IS_VALID_STREET = (val: string): boolean | string => {
  return (
    (isNotEmpty(val) && isString(val)) || i18n.global.t('errors.invalid_street')
  );
};

const IS_VALID_HOUSE_NUMBER = (val: string): boolean | string => {
  return (
    (isInt(parseInt(val, 10)) && isPositive(parseInt(val, 10))) ||
    i18n.global.t('errors.invalid_number')
  );
};

const IS_VALID_ZIP = (val: string): boolean | string => {
  return ZIP_REGEX.test(val) || i18n.global.t('errors.invalid_zip_code');
};

const IS_VALID_CITY = (val: string): boolean | string => {
  return (
    (isNotEmpty(val) && isString(val)) || i18n.global.t('errors.invalid_city')
  );
};

const IS_NOT_NULL = (val: unknown): boolean => {
  return val !== null && val !== undefined;
};

const IS_VALID_NAME = classValidatorRule(
  isString,
  i18n.global.t('errors.invalid_name')
);

const IS_VALID_PASSWORD = (val: string): boolean | string => {
  return PASSWORD_REGEX.test(val) || i18n.global.t('errors.invalid_password');
};

const IS_OPTIONAL_PHONE_NUMBER = (
  val: string,
  region: CountryCode
): string | boolean => {
  return (
    (isString(val) && val.length === 0) ||
    isPhoneNumber(val, region) ||
    i18n.global.t('errors.invalid_phone_number')
  );
};

const IS_VALID_PHONE_NUMBER = (
  val: string,
  region: CountryCode
): boolean | string => {
  return (
    isPhoneNumber(val, region) || i18n.global.t('errors.invalid_phone_number')
  );
};

const IS_VALID_STRING = (val: string | undefined): boolean =>
  !!(val && val.length > 0);

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
  return (
    classValidatorRule(isDate, i18n.global.t('errors.invalid_date')) &&
    isValid(val) &&
    val.getFullYear() > 1900 &&
    val.getFullYear() < 2100
  );
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

const IS_SELECTED = (val: unknown): boolean | string => {
  return IS_NOT_NULL(val) || i18n.global.t('errors.no_selection');
};

const IS_VERIFICATION_CODE = (val: string): boolean | string => {
  return (
    VERIFICATION_CODE_REGEX.test(val) ||
    i18n.global.t('errors.no_verification_code')
  );
};

export {
  IS_EMAIL,
  IS_VALID_STREET,
  IS_VALID_HOUSE_NUMBER,
  IS_VALID_ZIP,
  IS_VALID_CITY,
  IS_NOT_NULL,
  IS_VALID_NAME,
  IS_VALID_PASSWORD,
  IS_OPTIONAL_PHONE_NUMBER,
  IS_VALID_PHONE_NUMBER,
  IS_VALID_STRING,
  IS_VALID_TIME,
  IS_VALID_DATE_STRING,
  IS_VALID_FUTURE_DATE,
  IS_VALID_DATE,
  IS_SELECTED,
  IS_VERIFICATION_CODE,
};
