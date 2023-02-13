import { CountryCode } from 'libphonenumber-js';

/**
 * This type represents a country's phone number code (e.g. +41 for CH) and the input mask
 * for a valid number (e.g. ## ### ## ## for CH), if there is a fixed one
 */
// TODO: Maybe create class country code instead of using package?
export type PhoneCountryCode = {
  code: CountryCode;
  label: string;
  mask: string | undefined;
  value: string;
};
