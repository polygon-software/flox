import { GenericOption } from '../data/types/GenericOption';
import { LANGUAGECODES, LANGUAGES } from '../../../LANGUAGES';

/**
 * Returns a list of language options for the SelectLanguageField
 */
export default function availableLanguageOptions(): GenericOption[] {
  return [
    { value: LANGUAGECODES.DE, label: LANGUAGES.DE },
    { value: LANGUAGECODES.EN, label: LANGUAGES.EN },
    { value: LANGUAGECODES.FR, label: LANGUAGES.FR },
    { value: LANGUAGECODES.IT, label: LANGUAGES.IT },
  ];
}
