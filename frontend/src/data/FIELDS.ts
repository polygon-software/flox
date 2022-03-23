import {
  IS_EMAIL,
  IS_VALID_PASSWORD,
  IS_VALID_STRING,
  IS_VALID_BIRTHDATE,
} from './RULES';
import { QInput } from 'quasar';
import PasswordRepeat from 'components/forms/fields/PasswordRepeat.vue';
import Password from 'components/forms/fields/Password.vue';
import { markRaw } from 'vue';
import { i18n } from 'boot/i18n';

/**
 * This file contains bootstrap configurations for sign up and sign in input fields. With these, the corresponding forms can be built modularly.
 *
 * Required attributes
 * @key: Unique identifier
 * @component: A Vue component, which may also be custom. Must be marked as raw using 'markRaw'
 *
 * Optional attributes
 * @type: A quasar type
 * @label: The fields displayed name
 * @lazy_rules: Check at https://quasar.dev/vue-components/input
 * @rules: Rules that get applied to the input field, e.g. to check if a password is valid.
 */

export interface Field {
  key: string;
  component: any;
  attributes: {
    rules: Array<(val: any, ...args: any[]) => boolean | string>;
    [key: string]: any;
  };
}

const FIELDS: Record<string, Field> = {
  EMAIL: {
    key: 'email',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'email',
      label: i18n.global.t('account_data.email'),
      lazy_rules: 'ondemand',
      outlined: true,
      rules: [
        (val: string): boolean | string =>
          IS_EMAIL(val) || i18n.global.t('errors.invalid_email'),
      ],
    },
  },
  USERNAME: {
    key: 'username',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('account_data.username'),
      lazy_rules: 'true',
      outlined: true,
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
      rules: [
        (val: string): boolean | string =>
          IS_VALID_PASSWORD(val) || i18n.global.t('errors.invalid_password'),
      ],
    },
  },
  PASSWORD_REPEAT: {
    key: 'password_repeat',
    component: markRaw(PasswordRepeat),
    attributes: {
      rules: [
        (val: string): boolean | string =>
          IS_VALID_PASSWORD(val) || i18n.global.t('errors.invalid_password'),
      ],
    },
  },
  FULL_NAME: {
    key: 'full_name',
    component: markRaw(QInput),
    attributes: {
      outlined: true,
      dense: true,
      type: 'text',
      label: i18n.global.t('account_data.full_name'),
      lazy_rules: 'true',
      rules: [
        (val: string): boolean | string =>
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
    },
  },
  PHONE_NUMBER: {
    key: 'phone_number',
    component: markRaw(QInput),
    attributes: {
      outlined: true,
      dense: true,
      type: 'tel',
      label: i18n.global.t('account_data.phone_number'),
      lazy_rules: 'ondemand',
      mask: '### ### ## ##',
      rules: [
        (val: string): boolean | string =>
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_phone_number'),
      ],
    },
  },
  BIRTHDATE: {
    key: 'birthdate',
    component: markRaw(QInput),
    attributes: {
      type: 'date',
      outlined: true,
      dense: true,
      label: i18n.global.t('account_data.birthdate'),
      lazy_rules: 'ondemand',
      rules: [
        (val: string): boolean | string =>
          IS_VALID_BIRTHDATE(val) || i18n.global.t('errors.invalid_birth_date'),
      ],
    },
  },
};

export { FIELDS };
