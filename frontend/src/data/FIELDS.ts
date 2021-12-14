import {IS_VALID_EMAIL, IS_VALID_OPTION, IS_VALID_STRING} from './RULES'
import {QInput, QSelect} from 'quasar'
import PasswordRepeatField from 'components/forms/fields/company_signup/PasswordRepeatField.vue'
import Password from 'components/forms/fields/Password.vue'
import CompanyAddressField from 'components/forms/fields/company_signup/CompanyAddressField.vue'
import CompanyDataField from 'components/forms/fields/company_signup/CompanyDataField.vue'
import FullNameField from 'components/forms/fields/company_signup/FullNameField.vue'
import ConditionsField from 'components/forms/fields/company_signup/ConditionsField.vue'
import UploadFields from 'components/forms/fields/document_upload/UploadFields.vue'
import UserType from 'components/forms/fields/generic/UserType.vue'
import {markRaw} from 'vue';
import {i18n} from 'boot/i18n';

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
  key: string,
  component: any,
  attributes: {
    rules: Array<(val: any) => boolean|string>
    [key: string]: any
  },
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
        rules: [(val: string): boolean|string  => IS_VALID_EMAIL(val) || i18n.global.t('errors.invalid_email')]
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
        rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_username')]
      },
    },
    PASSWORD: {
      key: 'password',
      component: markRaw(Password),
      attributes: {
        rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_password')]
      }
    },
  PASSWORD_REPEAT: {
      key: 'password_repeat',
      component: markRaw(PasswordRepeatField),
      attributes: {
        rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_password')]
      }
    },
  PHONE_NUMBER: {
    key: 'phone_number',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'tel',
      label: i18n.global.t('account_data.phone_number'),
      lazy_rules: 'ondemand',
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_phone_number')]
    },
  },
  FULL_NAME: {
    key: 'full_name',
    component: markRaw(FullNameField),
    attributes: {
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name')]
    },
  },
  ABBREVIATION: {
    key: 'abbreviation',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      label: i18n.global.t('account_data.abbreviation'),
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_name')]
    },
  },
  LANGUAGE: {
    key: 'language',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('account_data.language'),
      options: ['DE', 'EN', 'FR', 'IT'], // TODO possibly move elsewhere.
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, ['DE', 'EN', 'FR', 'IT']) || i18n.global.t('errors.invalid_option')]
    },
  },
  SALUTATION: {
    key: 'salutation',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('account_data.salutation'),
      options: ['Herr', 'Frau', 'Divers'], // TODO possibly move elsewhere.
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, ['Herr', 'Frau', 'Divers']) || i18n.global.t('errors.invalid_option')]
    },
  },
  COMPANY_FUNCTION: {
    key: 'company_function',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('account_data.company_function'),
      options: ['CEO', 'Admin', 'Entwickler*in', 'HR', 'Blablabla'], // TODO possibly move elsewhere.
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, ['CEO', 'Admin', 'Entwickler*in', 'HR', 'Blablabla']) || i18n.global.t('errors.invalid_option')]
    },
  },
  COMPANY_ADDRESS: {
    key: 'company_address',
    component: markRaw(CompanyAddressField),
    attributes: {
      rules: [] // Validated by component
    },
  },
  COMPANY_DATA: {
    key: 'company_data',
    component: markRaw(CompanyDataField),
    attributes: {
      rules: [] // Validated by component
    },
  },
  CONDITIONS: {
      key: 'conditions',
      component: markRaw(ConditionsField),
      attributes: {
        rules: [] // Validated by component
      }
  },
  FILE_UPLOAD: {
      key: 'file_upload',
      component: markRaw(UploadFields),
      attributes: {
          rules: [] // Validated by component
      }
  },
  ROUTE_TARGET: {
      key: 'route_target',
      component: markRaw(UserType),
      attributes: {
          rules: [(val: string): boolean|string => val !== null || i18n.global.t('errors.missing_user_type')] // No validation needed
      }
  }
}

export {FIELDS}
