import { markRaw } from 'vue';
import { isString } from 'class-validator';

import SendInviteField from 'src/flox/modules/form/components/fields/general/SendInviteField.vue';
import GenericSelectField from 'src/flox/modules/form/components/fields/general/GenericSelectField.vue';
import { i18n } from 'boot/i18n';
import {
  DEVICE_TYPE,
  FLOOR,
  LEGAL_FORM,
  translatedObjects,
} from 'src/data/ENUM';
import ArticleNumbersField from 'src/flox/modules/form/components/fields/general/ArticleNumbersField.vue';
import TimeRecordingField from 'src/flox/modules/form/components/fields/general/TimeRecordingField.vue';
import FileUploadField from 'src/flox/modules/form/components/fields/general/FileUploadField.vue';
import JobInformationField from 'src/flox/modules/form/components/fields/general/JobInformationField.vue';

import AddressField from '../components/fields/general/AddressField.vue';
import DateField from '../components/fields/general/DateField.vue';
import EmailRepeatField from '../components/fields/general/EmailRepeatField.vue';
import FullNameField from '../components/fields/general/FullNameField.vue';
import GeneratedPasswordField from '../components/fields/general/GeneratedPasswordField.vue';
import GenericInputField from '../components/fields/general/GenericInputField.vue';
import Password from '../components/fields/general/PasswordField.vue';
import PasswordRepeat from '../components/fields/general/PasswordRepeatField.vue';
import PhoneNumberField from '../components/fields/general/PhoneNumberField.vue';
import SelectLanguageField from '../components/fields/general/SelectLanguageField.vue';
import FloorNumberField from '../components/fields/general/FloorNumberField.vue';
import { classValidatorRule } from '../helpers/validation-helpers';
import {
  availablePhonenNumberOptions,
  availableUserRoles,
} from '../helpers/generation-helpers';

import { Field } from './types/Field';
import {
  IS_EMAIL,
  IS_SELECTED,
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
      label: i18n.global.t('authentication.email'),
      rules: [],
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
  PASSWORD_LOGIN: {
    key: 'passwordLogin',
    component: markRaw(Password),
    attributes: {
      forLogin: true,
      rules: [
        classValidatorRule(isString, i18n.global.t('errors.invalid_password')),
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
  ARTICLE_NUMBERS: {
    key: 'articleNumbers',
    component: markRaw(ArticleNumbersField),
    attributes: {
      rules: [],
    },
  },
  TIME_RECORDINGS: {
    key: 'timeRecording',
    component: markRaw(TimeRecordingField),
    attributes: {
      rules: [],
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
      rules: [],
      width: 100,
    },
  },
  OWNER: {
    key: 'owner',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'text',
      label: i18n.global.t('fields.owner'),
      rules: [],
    },
  },
  OBJECT_NUMBER: {
    key: 'objectNumber',
    component: markRaw(GenericInputField),
    attributes: {
      label: i18n.global.t('fields.object_number'),
      type: 'number',
      rules: [],
    },
  },
  TOTAL_AMOUNT: {
    key: 'totalAmount',
    component: markRaw(GenericInputField),
    attributes: {
      label: i18n.global.t('fields.total_amount'),
      type: 'number',
      rules: [],
    },
  },
  FILE_UPLOAD: {
    key: 'fileUpload',
    component: markRaw(FileUploadField),
    attributes: {
      rules: [],
    },
  },
  EMPLOYEE_ABBREVIATION: {
    key: 'employeeAbbreviation',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'text',
      label: i18n.global.t('fields.employee_abbreviation'),
      rules: [],
    },
  },
  COMPANY_NAME: {
    key: 'companyName',
    component: markRaw(GenericInputField),
    attributes: {
      dense: true,
      type: 'text',
      label: i18n.global.t('fields.company_name'),
      rules: [],
    },
  },
  FULL_NAME: {
    key: 'fullName',
    component: markRaw(FullNameField),
    attributes: {
      showOptionalFields: false,
      optional: true,
      dense: true,
      rules: [],
    },
  },
  ADDRESS: {
    key: 'address',
    component: markRaw(AddressField),
    attributes: {
      optional: true,
      create: true,
      rules: [],
    },
  },
  EXTENDED_ADDRESS: {
    key: 'extendedAddress',
    component: markRaw(AddressField),
    attributes: {
      optional: true,
      create: true,
      showAdditionalAddress: true,
      rules: [],
    },
  },
  DATE: {
    key: 'date',
    component: markRaw(DateField),
    attributes: {
      rules: [],
    },
  },
  PROTOCOL_DATE: {
    key: 'protocolDate',
    component: markRaw(DateField),
    attributes: {
      optional: true,
      label: i18n.global.t('fields.protocol_date'),
      rules: [],
    },
  },
  END_DATE: {
    key: 'endDate',
    component: markRaw(DateField),
    attributes: {
      optional: true,
      label: i18n.global.t('fields.end_date'),
      rules: [],
    },
  },
  INTERNAL_ORDER_NUMBER: {
    key: 'internalOrderNumber',
    component: markRaw(GenericInputField),
    attributes: {
      label: i18n.global.t('fields.internal_order_number'),
      type: 'number',
      rules: [],
    },
  },
  EXTERNAL_ORDER_NUMBER: {
    key: 'externalOrderNumber',
    component: markRaw(GenericInputField),
    attributes: {
      label: i18n.global.t('fields.external_order_number'),
      type: 'number',
      rules: [],
    },
  },
  PHONE_NUMBER: {
    key: 'phoneNumber',
    component: markRaw(PhoneNumberField),
    attributes: {
      countryCodes: availablePhonenNumberOptions(),
      rules: [],
    },
  },
  PROBLEM_DESCRIPTION: {
    key: 'problemDescription',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'textarea',
      label: i18n.global.t('fields.problem_description'),
      rules: [],
      height: 400,
    },
  },
  FREE_TEXT: {
    key: 'freeText',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'textarea',
      label: i18n.global.t('fields.free_text'),
      rules: [],
      height: 400,
    },
  },
  SELECT_LANGUAGE: {
    key: 'selectLanguage',
    component: markRaw(SelectLanguageField),
    attributes: {
      rules: [IS_SELECTED],
    },
  },
  SELECT_POWER_MEASUREMENT: {
    key: 'selectPowerMeasurement',
    component: markRaw(GenericSelectField),
    attributes: {
      label: i18n.global.t('fields.measure_power'),
      options: [
        { label: i18n.global.t('general.yes'), value: true },
        { label: i18n.global.t('general.no'), value: false },
      ],
      rules: [],
    },
  },
  JOB_INFORMATION: {
    key: 'jobInformation',
    component: markRaw(JobInformationField),
    attributes: {
      rules: [],
    },
  },
  SELECT_DEVICE_TYPE: {
    key: 'selectDeviceType',
    component: markRaw(GenericSelectField),
    attributes: {
      label: i18n.global.t('fields.device_type'),
      options: translatedObjects(DEVICE_TYPE, 'device_type'),
      rules: [],
    },
  },
  MANUFACTURER: {
    key: 'manufacturer',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'text',
      label: i18n.global.t('fields.manufacturer'),
      rules: [],
    },
  },
  MODEL: {
    key: 'model',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'text',
      label: i18n.global.t('fields.model'),
      rules: [],
    },
  },
  PRODUCTION_NUMBER: {
    key: 'productionNumber',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'text',
      label: i18n.global.t('fields.production_number'),
      rules: [],
    },
  },
  PRODUCTION_YEAR: {
    key: 'productionYear',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'number',
      mask: '####',
      label: i18n.global.t('fields.production_year'),
      rules: [],
    },
  },
  INFORMATION: {
    key: 'information',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'textarea',
      label: i18n.global.t('fields.information'),
      rules: [],
    },
  },
  PROTOCOL: {
    key: 'protocol',
    component: markRaw(GenericInputField),
    attributes: {
      type: 'textarea',
      label: i18n.global.t('fields.protocol'),
      rules: [],
    },
  },
  COMPANY_LEGAL_FORM: {
    key: 'companyLegalForm',
    component: markRaw(GenericSelectField),
    attributes: {
      label: i18n.global.t('fields.company_legal_form'),
      options: translatedObjects(LEGAL_FORM, 'legal_form'),
      rules: [],
    },
  },
  FLOOR: {
    key: 'floor',
    component: markRaw(GenericSelectField),
    attributes: {
      label: i18n.global.t('fields.floor'),
      options: translatedObjects(FLOOR, 'floor'),
      rules: [],
    },
  },
  FLOOR_NUMBER: {
    key: 'floorNumber',
    component: markRaw(FloorNumberField),
    attributes: {
      rules: [],
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
    component: markRaw(GenericSelectField),
    attributes: {
      label: i18n.global.t('fields.authentication.user_role'),
      options: availableUserRoles(),
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
