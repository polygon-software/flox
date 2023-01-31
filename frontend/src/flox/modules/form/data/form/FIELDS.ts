import { markRaw } from 'vue';
import { QInput } from 'quasar';

import { i18n } from 'boot/i18n';

import {
  IS_EMAIL,
  IS_NOT_NULL,
  IS_VALID_PASSWORD,
  IS_VALID_STRING,
} from '../RULES';
import PasswordRepeat from '../../components/fields/general/PasswordRepeatField.vue';
import Password from '../../components/fields/general/PasswordField.vue';
import AddressField from '../../components/fields/general/AddressField.vue';
import FullNameField from '../../components/fields/general/FullNameField.vue';
import GenericInputField from '../../components/fields/general/GenericInputField.vue';
import EmailRepeatField from '../../components/fields/general/EmailRepeatField.vue';
import { Field } from '../types/Field';
import FullName from '../types/FullName';

/**
 * This file contains bootstrap configurations for sign up and sign in input fields. With these, the corresponding forms can be built modularly.
 */

const selectionError = i18n.global.t('errors.no_selection');

const FIELDS: Record<string, Field> = {
  EMAIL: {
    key: 'email',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'email',
      label: i18n.global.t('authentication.email'),
      rules: [
        (val: string): boolean | string =>
          IS_EMAIL(val) || i18n.global.t('errors.invalid_email'),
      ],
    },
  },
  EMAIL_REPEAT: {
    key: 'emailRepeat',
    component: markRaw(EmailRepeatField),
    attributes: {
      rules: [
        (val: string): boolean | string =>
          IS_EMAIL(val) || i18n.global.t('errors.invalid_email'),
      ],
    },
  },
  USERNAME: {
    key: 'username',
    component: markRaw(GenericInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('authentication.username'),
      rules: [
        (val: string): boolean | string =>
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_username'),
      ],
    },
  },
  PASSWORD: {
    key: 'password',
    component: markRaw(Password),
    attributes: {
      rules: [],
    },
  },
  PASSWORD_REPEAT: {
    key: 'passwordRepeat',
    component: markRaw(PasswordRepeat),
    attributes: {
      newPassword: false,
      rules: [
        (val: string): boolean | string =>
          IS_VALID_PASSWORD(val) || i18n.global.t('errors.invalid_password'),
      ],
    },
  },
  PASSWORD_REPEAT_NEW: {
    key: 'passwordRepeat',
    component: markRaw(PasswordRepeat),
    attributes: {
      newPassword: true,
      rules: [
        (val: string): boolean | string =>
          IS_VALID_PASSWORD(val) || i18n.global.t('errors.invalid_password'),
      ],
    },
  },
  NAME: {
    key: 'name',
    component: markRaw(GenericInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('authentication.name'),
      rules: [
        (val: string): boolean | string =>
          // eslint-disable-next-line sonarjs/no-duplicate-string
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
      width: 100,
    },
  },
  FIRST_NAME: {
    key: 'firstName',
    component: markRaw(GenericInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('authentication.first_name'),
      rules: [
        (val: string): boolean | string =>
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
    },
  },
  MIDDLE_NAME: {
    key: 'middleName',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('dossier.privateCustomer.middleName'),
      rules: [
        (val: string): boolean | string =>
          !val || IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
    },
  },
  LAST_NAME: {
    key: 'lastName',
    component: markRaw(GenericInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('authentication.last_name'),
      rules: [
        (val: string): boolean | string =>
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
    },
  },
  SECOND_LAST_NAME: {
    key: 'secondLastName',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('dossier.privateCustomer.secondLastName'),
      rules: [
        (val: string): boolean | string =>
          !val || IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
    },
  },
  FULL_NAME: {
    key: 'fullName',
    component: markRaw(FullNameField),
    attributes: {
      dense: true,
      rules: [
        (val: FullName): boolean | string =>
          (!!val && val.isComplete()) || selectionError,
      ],
    },
  },
  ADDRESS: {
    key: 'address',
    component: markRaw(AddressField),
    attributes: {
      create: true,
      rules: [
        (val: Record<string, string>): boolean | string =>
          IS_NOT_NULL(val) || i18n.global.t('errors.invalid_address'),
      ],
    },
  },
};

// eslint-disable-next-line import/prefer-default-export
export { FIELDS };
