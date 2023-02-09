import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';
import { forgotPasswordFormKey } from './FormKeys';

// Enter e-mail
const forgotPasswordCard = new FormCard(
  forgotPasswordFormKey.cardKey,
  [FIELDS.EMAIL],
  i18n.global.t('cardTitles.forgot_password')
);

// Forgot password form pages with respective cards
export default [
  new FormPage(
    forgotPasswordFormKey.pageKey,
    i18n.global.t('authentication.reset_password'),
    [forgotPasswordCard]
  ),
];
