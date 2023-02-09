import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';
import { MFAFormKey } from './FormKeys';

// MFA
const MFACard = new FormCard(
  MFAFormKey.cardKey,
  [FIELDS.MFA],
  i18n.global.t('cardTitles.MFA')
);

// MFA form pages with respective cards
export default [
  new FormPage(MFAFormKey.pageKey, i18n.global.t('authentication.MFA'), [
    MFACard,
  ]),
];
