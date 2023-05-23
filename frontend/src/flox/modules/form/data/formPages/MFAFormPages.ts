import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';
import { FIELDS } from '../FIELDS';
import { MFAFormKey } from '../FORM_KEYS';

// MFA
const MFACard = new FormCard(
  MFAFormKey.cardKey,
  [[FIELDS.MFA]],
  i18n.global.t('card_titles.mfa')
);

// MFA form pages with respective cards
export default [
  new FormPage(MFAFormKey.pageKey, i18n.global.t('authentication.mfa'), [
    MFACard,
  ]),
];
