import { PhoneCountryCode } from 'src/flox/modules/form/data/types/PhoneCountryCode';

import { GenericOption } from '../data/types/GenericOption';
import { COUNTRY_CODES } from '../../../COUNTRIES';
import { LANGUAGES } from '../../../LANGUAGES';

/**
 * Returns a list of language options for the SelectLanguageField
 */
export function availableLanguageOptions(): GenericOption[] {
  return [
    { label: LANGUAGES.DE, value: COUNTRY_CODES.DE },
    { label: LANGUAGES.EN, value: COUNTRY_CODES.EN },
    { label: LANGUAGES.FR, value: COUNTRY_CODES.FR },
    { label: LANGUAGES.IT, value: COUNTRY_CODES.IT },
  ];
}

/**
 * Returns a list of phone number options for the PhoneNumberField
 * @returns - Available phone number options
 * TODO: Customize for specific application
 */
export function availablePhonenNumberOptions(): PhoneCountryCode[] {
  return [
    {
      code: COUNTRY_CODES.CH,
      label: '+41',
      mask: '## ### ## ##',
      value: '+41',
    },
    { code: COUNTRY_CODES.DE, label: '+49', mask: undefined, value: '+49' },
  ];
}
