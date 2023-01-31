import { i18n } from 'boot/i18n';
import * as auth from 'src/flox/modules/auth';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';

// Login
const loginCard = new FormCard(
  'login',
  [
    auth.moduleConfig().emailAsUsername ? FIELDS.EMAIL : FIELDS.USERNAME,
    FIELDS.PASSWORD,
  ],
  i18n.global.t('dossier.cardTitles.login')
);

// Login form pages with respective cards
export default [
  new FormPage('loginPage', i18n.global.t('authentication.login'), [loginCard]),
];
