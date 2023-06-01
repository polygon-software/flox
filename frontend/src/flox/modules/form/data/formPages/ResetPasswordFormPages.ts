import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';
import { FIELDS } from '../FIELDS';
import { resetPasswordFormKey } from '../FORM_KEYS';

// Reset password
const resetPasswordCard = new FormCard(
  resetPasswordFormKey.cardKey,
  [[FIELDS.VERIFICATION_CODE, FIELDS.PASSWORD_REPEAT_NEW]],
  i18n.global.t('card_titles.set_new_password')
);

// Reset password form pages with respective cards
export default [
  new FormPage(
    resetPasswordFormKey.pageKey,
    i18n.global.t('authentication.set_new_password'),
    [resetPasswordCard]
  ),
];
