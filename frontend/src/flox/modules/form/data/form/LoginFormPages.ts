import { i18n } from 'boot/i18n';

import * as auth from '../../../auth';
import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';
import { loginFormKey } from './FormKeys';

// Login
const loginCard = new FormCard(
  loginFormKey.cardKey,
  [
    auth.moduleConfig().emailAsUsername ? FIELDS.EMAIL : FIELDS.USERNAME,
    FIELDS.PASSWORD,
  ],
  i18n.global.t('cardTitles.login')
);

// Login form pages with respective cards
export default [
  new FormPage(loginFormKey.pageKey, i18n.global.t('authentication.login'), [
    loginCard,
  ]),
];
