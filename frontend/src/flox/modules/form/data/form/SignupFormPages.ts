import { i18n } from 'boot/i18n';
import * as auth from 'src/flox/modules/auth';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';

const fields = auth.moduleConfig().emailAsUsername
  ? [FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT]
  : [FIELDS.USERNAME, FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT];

// Signup
const signupCard = new FormCard(
  'signup',
  fields,
  i18n.global.t('dossier.cardTitles.signup')
);

// Signup form pages with respective cards
export default [
  new FormPage('signupPage', i18n.global.t('authentication.signup'), [
    signupCard,
  ]),
];
