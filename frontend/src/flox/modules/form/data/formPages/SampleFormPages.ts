import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';
import { FIELDS } from '../FIELDS';
import { sampleFormKey } from '../FORM_KEYS';

// Sample card
const sampleCard = new FormCard(
  sampleFormKey.cardKey,
  [FIELDS.DATE],
  i18n.global.t('card_titles.sample')
);

// Sample formPages pages with respective cards
export default [
  new FormPage(sampleFormKey.pageKey, i18n.global.t('general.sample'), [
    sampleCard,
  ]),
];
