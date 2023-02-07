import { PhoneCountryCode } from 'src/flox/modules/form/data/types/PhoneCountryCode';

import { GenericOption } from '../data/types/GenericOption';
import { LANGUAGECODES, LANGUAGES } from '../../../LANGUAGES';

/**
 * Returns a list of language options for the SelectLanguageField
 */
export default function availableLanguageOptions(): GenericOption[] {
  return [
    { label: LANGUAGES.DE, value: LANGUAGECODES.DE },
    { label: LANGUAGES.EN, value: LANGUAGECODES.EN },
    { label: LANGUAGES.FR, value: LANGUAGECODES.FR },
    { label: LANGUAGES.IT, value: LANGUAGECODES.IT },
  ];
}

/**
 * Returns a list of phone number options for the PhoneNumberField
 * TODO: Customize for specific application
 */
export default function getPhonenNumberOptions(): PhoneCountryCode[] {
  return [
    { code: 'CH', label: '+41', mask: '## ### ## ##', value: '+41' },
    { code: 'DE', label: '+49', mask: undefined, value: '+49' },
  ];
}
