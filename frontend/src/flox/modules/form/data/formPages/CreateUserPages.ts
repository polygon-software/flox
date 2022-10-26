import { i18n } from 'boot/i18n';

import * as auth from '../../../auth';
import FormPage from '../types/FormPage';
import FormCard from '../types/FormCard';
import { FIELDS } from '../FIELDS';
import { createUserFormKey } from '../FORM_KEYS';

const fields = auth.moduleConfig().emailAsUsername
  ? [
      FIELDS.EMAIL,
      FIELDS.SELECT_LANGUAGE,
      FIELDS.USER_ROLE,
      FIELDS.SEND_INVITE,
      FIELDS.GENERATED_PASSWORD,
    ]
  : [
      FIELDS.USERNAME,
      FIELDS.EMAIL,
      FIELDS.SELECT_LANGUAGE,
      FIELDS.USER_ROLE,
      FIELDS.SEND_INVITE,
      FIELDS.GENERATED_PASSWORD,
    ];

// Create user
const createUserCard = new FormCard(
  createUserFormKey.cardKey,
  fields,
  i18n.global.t('card_titles.create_user')
);

// Create user form pages with respective cards
export default [
  new FormPage(
    createUserFormKey.pageKey,
    i18n.global.t('authentication.create_user'),
    [createUserCard]
  ),
];
