import { i18n } from 'boot/i18n';
import * as auth from 'src/flox/modules/auth';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';
import { signupFormKey } from './FormKeys';

const fields = auth.moduleConfig().emailAsUsername
  ? [FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT]
  : [FIELDS.USERNAME, FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT];

// Signup
const signupCard = new FormCard(
  signupFormKey.cardKey,
  fields,
  i18n.global.t('card_titles.signup')
);

// Signup form pages with respective cards
export default [
  new FormPage(signupFormKey.pageKey, i18n.global.t('authentication.signup'), [
    signupCard,
  ]),
];
