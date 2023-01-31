import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';

// Sample card
const sampleCard = new FormCard(
  'sample',
  [FIELDS.USERNAME],
  i18n.global.t('path.to.label')
);

// Sample form pages with respective cards
export default [
  new FormPage('samplePage', i18n.global.t('path.to.label'), [sampleCard]),
];
