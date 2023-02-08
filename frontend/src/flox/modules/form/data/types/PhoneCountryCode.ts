/**
 * This type represents a country's phone number code (e.g. +41 for CH) and the input mask
 * for a valid number (e.g. ## ### ## ## for CH).
 */
export type PhoneCountryCode = {
  label: string;
  value: string;
  mask: string;
};
