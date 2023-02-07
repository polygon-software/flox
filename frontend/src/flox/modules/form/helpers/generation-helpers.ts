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
