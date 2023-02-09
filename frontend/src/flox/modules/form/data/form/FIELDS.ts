import { markRaw } from 'vue';
import { CountryCode } from 'libphonenumber-js';

import { i18n } from 'boot/i18n';
import { availablePhonenNumberOptions } from 'src/flox/modules/form/helpers/generation-helpers';

import {
  IS_EMAIL,
  IS_NOT_NULL,
  IS_VALID_DATE,
  IS_VALID_PASSWORD,
  IS_VALID_PHONE_NUMBER,
  IS_VALID_STRING,
} from '../RULES';
import AddressField from '../../components/fields/general/AddressField.vue';
import DateField from '../../components/fields/general/DateField.vue';
import EmailRepeatField from '../../components/fields/general/EmailRepeatField.vue';
import FullNameField from '../../components/fields/general/FullNameField.vue';
import GenericInputField from '../../components/fields/general/GenericInputField.vue';
import Password from '../../components/fields/general/PasswordField.vue';
import PasswordRepeat from '../../components/fields/general/PasswordRepeatField.vue';
import PhoneNumberField from '../../components/fields/general/PhoneNumberField.vue';
import SelectLanguageField from '../../components/fields/general/SelectLanguageField.vue';
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
  OLD_PASSWORD: {
    key: 'oldPassword',
    component: markRaw(GenericInputField),
    attributes: {
      rules: [
        (val: string): boolean | string =>
          IS_VALID_STRING(val || i18n.global.t('errors.invalid_old_password')),
      ],
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
      label: i18n.global.t('fields.personal_data.name'),
      rules: [
        (val: string): boolean | string =>
          // eslint-disable-next-line sonarjs/no-duplicate-string
          IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name'),
      ],
      width: 100,
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
  DATE: {
    key: 'date',
    component: markRaw(DateField),
    attributes: {
      rules: [
        (val: Date): boolean | string =>
          IS_VALID_DATE(val) || i18n.global.t('errors.invalid_date'),
      ],
    },
  },
  PHONE_NUMBER: {
    key: 'phoneNumber',
    component: markRaw(PhoneNumberField),
    attributes: {
      countryCodes: availablePhonenNumberOptions(),
      rules: [
        (val: { number: string; countryCode: CountryCode }): boolean | string =>
          IS_VALID_PHONE_NUMBER(val.number, val.countryCode) ||
          i18n.global.t('errors.invalid_phone_number'),
      ],
    },
  },
  SELECT_LANGUAGE: {
    key: 'selectLanguage',
    component: markRaw(SelectLanguageField),
    attributes: {
      rules: [
        (val: string): boolean | string => IS_NOT_NULL(val) || selectionError,
      ],
    },
  },
};
// eslint-disable-next-line import/prefer-default-export
export { FIELDS };
