import { i18n } from 'boot/i18n';

import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';

import { FIELDS } from './FIELDS';
import { changePasswordFormKey } from './FormKeys';

// Change password
const changePasswordCard = new FormCard(
  changePasswordFormKey.cardKey,
  [FIELDS.OLD_PASSWORD, FIELDS.PASSWORD_REPEAT],
  i18n.global.t('cardTitles.change_password')
);

// Change password form pages with respective cards
export default [
  new FormPage(
    changePasswordFormKey.pageKey,
    i18n.global.t('authentication.change_password'),
    [changePasswordCard]
  ),
];
