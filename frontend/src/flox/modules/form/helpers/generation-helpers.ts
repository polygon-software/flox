import { GenericOption } from '../data/types/GenericOption';
import COUNTRY_CODES from '../../../COUNTRIES';
import LANGUAGES from '../../../LANGUAGES';

/**
 * Returns a list of language options for the SelectLanguageField
 * @returns - Array with all available language options
 */
export default function availableLanguageOptions(): GenericOption[] {
  return [
    { label: LANGUAGES.DE, value: COUNTRY_CODES.DE },
    { label: LANGUAGES.EN, value: COUNTRY_CODES.EN },
    { label: LANGUAGES.FR, value: COUNTRY_CODES.FR },
    { label: LANGUAGES.IT, value: COUNTRY_CODES.IT },
  ];
}
