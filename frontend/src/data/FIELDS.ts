import {IS_VALID_EMAIL, IS_VALID_OPTION, IS_VALID_STRING} from './RULES'
import {QInput, QSelect} from 'quasar'
import PasswordRepeat from 'components/forms/fields/company_signup/PasswordRepeat.vue'
import Password from 'components/forms/fields/Password.vue'
import CompanyAddress from 'components/forms/fields/company_signup/CompanyAddress.vue'
import CompanyData from 'components/forms/fields/company_signup/CompanyData.vue'
import FullName from 'components/forms/fields/company_signup/FullName.vue'
import Conditions from 'components/forms/fields/company_signup/Conditions.vue'
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
        label: 'E-Mail',
        lazy_rules: 'ondemand',
        rules: [(val: string): boolean|string  => IS_VALID_EMAIL(val) || 'Please enter a valid e-mail address.']
      },
    },
    USERNAME: {
      key: 'username',
      component: markRaw(QInput),
      attributes: {
        dense: true,
        type: 'text',
        label: 'Username',
        lazy_rules: 'true',
        rules: [(val: string): boolean|string => IS_VALID_STRING(val) || 'Please enter a username']
      },
    },
    PASSWORD: {
      key: 'password',
      component: markRaw(Password),
      attributes: {
        rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('invalid_password')]
      }
    },
  PASSWORD_REPEAT: {
      key: 'password_repeat',
      component: markRaw(PasswordRepeat),
      attributes: {
        rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('invalid_password')]
      }
    },
  PHONE_NUMBER: {
    key: 'phone_number',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'tel',
      label: i18n.global.t('phone_number'),
      lazy_rules: 'ondemand',
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('invalid_phone_number')]
    },
  },
  FULL_NAME: {
    key: 'full_name',
    component: markRaw(FullName),
    attributes: {
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('invalid_name')]
    },
  },
  LANGUAGE: {
    key: 'language',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('language'),
      options: ['DE', 'EN', 'FR', 'IT'], // TODO possibly move elsewhere.
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, ['DE', 'EN', 'FR', 'IT']) || i18n.global.t('invalid_option')]
    },
  },
  COMPANY_ADDRESS: {
    key: 'company_address',
    component: markRaw(CompanyAddress),
    attributes: {
      rules: [] // Validated by component
    },
  },
  COMPANY_DATA: {
    key: 'company_data',
    component: markRaw(CompanyData),
    attributes: {
      rules: []
    },
  },
  CONDITIONS: {
      key: 'conditions',
      component: markRaw(Conditions),
      attributes: {
        rules: [] // Validated by component
      }
  }
}

export {FIELDS}
