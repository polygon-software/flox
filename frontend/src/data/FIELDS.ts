import {IS_VALID_DATE, IS_VALID_EMAIL, IS_VALID_OPTION, IS_VALID_STRING} from './RULES'
import {QInput, QSelect} from 'quasar'
import PasswordRepeatField from 'components/forms/fields/company_signup/PasswordRepeatField.vue'
import Password from 'components/forms/fields/Password.vue'
import CompanyAddressField from 'components/forms/fields/company_signup/CompanyAddressField.vue'
import CompanyDataField from 'components/forms/fields/company_signup/CompanyDataField.vue'
import FullNameField from 'components/forms/fields/company_signup/FullNameField.vue'
import ConditionsField from 'components/forms/fields/company_signup/ConditionsField.vue'
import CompanyUploadFields from 'components/forms/fields/document_upload/CompanyUploadFields.vue'
import UserType from 'components/forms/fields/generic/UserType.vue'
import AddressField from 'components/forms/fields/generic/AddressField.vue'
import InputDatePicker from 'components/forms/fields/generic/InputDatePicker.vue'
import DisabledInputField from 'components/forms/fields/generic/PropertyInputFields.vue'
import OptionGroupTitle from 'components/forms/fields/generic/OptionGroupTitle.vue'
import OwnerOccupiedOptionGroup from 'components/forms/fields/generic/OwnerOccupiedOptionGroup.vue'
import BuildingLeaseDropdown from 'components/forms/fields/generic/BuildingLeaseDropdown.vue'
import RenovationOptionGroup from 'components/forms/fields/generic/RenovationOptionGroup.vue'
import AmortisationOptionGroup from 'components/forms/fields/generic/AmortisationOptionGroup.vue'
import TypeOptionGroup from 'components/forms/fields/generic/TypeOptionGroup.vue'
import {markRaw} from 'vue';
import {i18n} from 'boot/i18n';
import {PROPERTY_TYPE} from '../../../shared/definitions/ENUMS';

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
  DATE_OF_BIRTH: {
    key: 'date_of_birth',
    component: markRaw(InputDatePicker),
    attributes: {
      dense: true,
      type: Date,
      label: i18n.global.t('employee_dashboard.date_of_birth'),
      lazy_rules: 'true',
      retirement_rule: true,
      rules: [(val: Date): boolean|string => IS_VALID_DATE(val) || i18n.global.t('errors.invalid_date')]
    },
  },
    COMPANY_NAME: {
    key: 'company_name',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('account_data.company'),
      lazy_rules: 'true',
      rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_company_name')]
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
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_abbreviation')]
    },
  },
  ADDRESS: {
    key: 'address',
    component: markRaw(AddressField),
    attributes: {
      rules: [] // Validated by component
    },
  },
  LANGUAGE: {
    key: 'language',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('account_data.language'),
      options: ['DE', 'EN', 'FR', 'IT'], // TODO possibly move elsewhere.
      // eslint-disable-next-line sonarjs/no-duplicate-string
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
      component: markRaw(CompanyUploadFields),
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
  },
  BANK: {
    key: 'bank',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('account_data.bank'),
      options: ['Raiffeisen', 'UBS', 'ZKB', 'LuKB'], //TODO: replace with real data
      // eslint-disable-next-line sonarjs/no-duplicate-string
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, ['Raiffeisen', 'UBS', 'ZKB', 'LuKB']) || i18n.global.t('errors.invalid_option')]
    },
  },
  PROPERTY_TYPE: {
    key: 'property_type',
    component: markRaw(QSelect),
    attributes: {
      label: i18n.global.t('form_for_clients.property_type'),
      options: Object.values(PROPERTY_TYPE),
      // eslint-disable-next-line sonarjs/no-duplicate-string
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, Object.values(PROPERTY_TYPE)) || i18n.global.t('errors.invalid_option')]
    },
  },
  OWNER_OCCUPIED: {
    key: 'property_type',
    component: markRaw(OptionGroupTitle),
    attributes: {
      label: i18n.global.t('form_for_clients.owner_occupied'),
      options: [{ label: i18n.global.t('general.yes'), value: true}, {label: i18n.global.t('general.no'), value: false}],
      // eslint-disable-next-line sonarjs/no-duplicate-string
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, [i18n.global.t('general.yes'), i18n.global.t('general.no')]) || i18n.global.t('errors.invalid_option')]
    },
  },
  DATE_OF_PURCHASE: {
    key: 'date_of_purchase',
    component: markRaw(InputDatePicker),
    attributes: {
      label: i18n.global.t('form_for_clients.date_of_purchase'),
      rules: [(val: Date): boolean|string => IS_VALID_DATE(val) || i18n.global.t('errors.invalid_date')]
    },
  },
  PRICE: {
    key: 'price',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      label: i18n.global.t('form_for_clients.price'),
      rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_amount')]
    },
  },
  MARKET_VALUE_ESTIMATION: {
    key: 'market_value_estimation',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('form_for_clients.market_value_estimation'),
      lazy_rules: 'true',
      rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_amount')]
    },
  },
  CURRENT_VALUE_OF_MORTGAGE: {
    key: 'current_value_of_mortgage',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('form_for_clients.current_value_of_mortgage'),
      lazy_rules: 'true',
      rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_amount')]
    },
  },
  ENFEOFFMENT: {
    key: 'enfeoffment',
    component: markRaw(DisabledInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('form_for_clients.enfeoffment'),
      lazy_rules: 'true',
      rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_amount')]
    },
  },
  PORTION: {
    key: 'portion',
    component: markRaw(QInput),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('form_for_clients.portion'),
      lazy_rules: 'true',
      rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_string')]
    },
  },
  BUILDING_LEASE: {
    key: 'building_lease',
    component: markRaw(BuildingLeaseDropdown),
    attributes: {
      dense: true,
      type: 'text',
      lazy_rules: 'true',
      rules: [(val: string): boolean|string => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_string')]
    },
  },
  EXPIRATION_DATE: {
    key: 'expiration_date',
    component: markRaw(InputDatePicker),
    attributes: {
      dense: true,
      type: Date,
      label: i18n.global.t('form_for_clients.expiration_date'),
      lazy_rules: 'true',
      rules: [(val: Date): boolean|string => IS_VALID_DATE(val) || i18n.global.t('errors.invalid_date')]
    },
  },
  RENOVATION: {
    key: 'property_type',
    component: markRaw(RenovationOptionGroup),
    attributes: {
      label: i18n.global.t('form_for_clients.renovation'),
      options: [{ label: i18n.global.t('general.yes'), value: true}, {label: i18n.global.t('general.no'), value: false}],
      // eslint-disable-next-line sonarjs/no-duplicate-string
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, [i18n.global.t('general.yes'), i18n.global.t('general.no')]) || i18n.global.t('errors.invalid_option')]
    },
  },
  RENOVATION_YEAR: {
    key: 'renovation_year',
    component: markRaw(InputDatePicker),
    attributes: {
      dense: true,
      type: Date,
      label: i18n.global.t('form_for_clients.renovation_year'),
      lazy_rules: 'true',
      rules: [(val: Date): boolean|string => IS_VALID_DATE(val) || i18n.global.t('errors.invalid_date')]
    },
  },
  AMORTISATION: {
    key: 'amortisation',
    component: markRaw(AmortisationOptionGroup),
    attributes: {
      label: i18n.global.t('form_for_clients.amortisation'),
      options: [{ label: i18n.global.t('general.yes'), value: true}, {label: i18n.global.t('general.no'), value: false}],
      // eslint-disable-next-line sonarjs/no-duplicate-string
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, [i18n.global.t('general.yes'), i18n.global.t('general.no')]) || i18n.global.t('errors.invalid_option')]
    },
  },
  TYPE: {
    key: 'amortisation',
    component: markRaw(TypeOptionGroup),
    attributes: {
      label: i18n.global.t('form_for_clients.type'),
      options: [{ label: i18n.global.t('form_for_clients.direct'), value: true}, {label: i18n.global.t('form_for_clients.indirect'), value: false}],
      // eslint-disable-next-line sonarjs/no-duplicate-string
      rules: [(val: string): boolean|string  => IS_VALID_OPTION(val, [i18n.global.t('form_for_clients.direct'), i18n.global.t('form_for_clients.indirect')]) || i18n.global.t('errors.invalid_option')]
    },
  },
}

export {FIELDS}
