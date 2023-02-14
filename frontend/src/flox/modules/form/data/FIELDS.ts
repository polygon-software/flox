import { markRaw } from 'vue';
import { isString } from 'class-validator';

import { i18n } from 'boot/i18n';

import AddressField from '../components/fields/general/AddressField.vue';
import DateField from '../components/fields/general/DateField.vue';
import EmailRepeatField from '../components/fields/general/EmailRepeatField.vue';
import FullNameField from '../components/fields/general/FullNameField.vue';
import GeneratedPasswordField from '../components/fields/general/GeneratedPasswordField.vue';
import GenericInputField from '../components/fields/general/GenericInputField.vue';
import Password from '../components/fields/general/PasswordField.vue';
import PasswordRepeat from '../components/fields/general/PasswordRepeatField.vue';
import PhoneNumberField from '../components/fields/general/PhoneNumberField.vue';
import UserRoleField from '../components/fields/general/UserRoleField.vue';
import SelectLanguageField from '../components/fields/general/SelectLanguageField.vue';
import SendInviteField from '../components/fields/general/SendInviteField.vue';
import { classValidatorRule } from '../helpers/validation-helpers';
import { availablePhonenNumberOptions } from '../helpers/generation-helpers';

import { Field } from './types/Field';
import {
  IS_EMAIL,
  IS_NOT_NULL,
  IS_SELECTED,
  IS_VALID_DATE,
  IS_VALID_NAME,
  IS_VALID_PASSWORD,
  IS_VERIFICATION_CODE,
} from './RULES';

/**
 * This file contains bootstrap configurations for sign up and sign in input fields. With these, the corresponding forms can be built modularly.
 */

const FIELDS: Record<string, Field> = {
  EMAIL: {
    key: 'email',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'email',
      label: i18n.global.t('authentication.email'),
      rules: [IS_EMAIL],
    },
  },
  EMAIL_REPEAT: {
    key: 'emailRepeat',
    component: markRaw(EmailRepeatField),
    attributes: {
      rules: [IS_EMAIL],
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
        classValidatorRule(isString, i18n.global.t('errors.invalid_username')),
      ],
    },
  },
  PASSWORD: {
    key: 'password',
    component: markRaw(Password),
    attributes: {
      rules: [IS_VALID_PASSWORD],
    },
  },
  OLD_PASSWORD: {
    key: 'oldPassword',
    component: markRaw(GenericInputField),
    attributes: {
      label: i18n.global.t('authentication.old_password'),
      rules: [
        classValidatorRule(
          isString,
          i18n.global.t('errors.invalid_old_password')
        ),
      ],
    },
  },
  PASSWORD_REPEAT: {
    key: 'passwordRepeat',
    component: markRaw(PasswordRepeat),
    attributes: {
      newPassword: false,
      rules: [IS_VALID_PASSWORD],
    },
  },
  PASSWORD_REPEAT_NEW: {
    key: 'passwordRepeat',
    component: markRaw(PasswordRepeat),
    attributes: {
      newPassword: true,
      rules: [IS_VALID_PASSWORD],
    },
  },
  NAME: {
    key: 'name',
    component: markRaw(GenericInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('fields.personal_data.name'),
      rules: [IS_VALID_NAME],
      width: 100,
    },
  },
  FULL_NAME: {
    key: 'fullName',
    component: markRaw(FullNameField),
    attributes: {
      dense: true,
      rules: [IS_SELECTED],
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
      rules: [IS_VALID_DATE],
    },
  },
  PHONE_NUMBER: {
    key: 'phoneNumber',
    component: markRaw(PhoneNumberField),
    attributes: {
      countryCodes: availablePhonenNumberOptions(),
      rules: [IS_NOT_NULL],
    },
  },
  SELECT_LANGUAGE: {
    key: 'selectLanguage',
    component: markRaw(SelectLanguageField),
    attributes: {
      rules: [IS_SELECTED],
    },
  },
  VERIFICATION_CODE: {
    key: 'verificationCode',
    component: markRaw(GenericInputField),
    attributes: {
      label: i18n.global.t('fields.authentication.verification_code'),
      mask: '######',
      rules: [IS_VERIFICATION_CODE],
    },
  },
  MFA: {
    key: 'MFA',
    component: markRaw(GenericInputField),
    attributes: {
      mask: '######',
      rules: [IS_VERIFICATION_CODE],
    },
  },
  USER_ROLE: {
    key: 'userRole',
    component: markRaw(UserRoleField),
    attributes: {
      rules: [IS_SELECTED],
    },
  },
  SEND_INVITE: {
    key: 'sendInvite',
    component: markRaw(SendInviteField),
    attributes: {
      rules: [IS_SELECTED],
    },
  },
  GENERATED_PASSWORD: {
    key: 'generatedPassword',
    component: markRaw(GeneratedPasswordField),
    attributes: {
      rules: [],
    },
  },
};
// eslint-disable-next-line import/prefer-default-export
export { FIELDS };
