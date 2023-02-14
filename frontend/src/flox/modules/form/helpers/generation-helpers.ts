import { i18n } from 'boot/i18n';

import { GenericOption } from '../data/types/GenericOption';
import { PhoneCountryCode } from '../data/types/PhoneCountryCode';
import COUNTRY_CODES from '../../../enum/COUNTRIES';
import DELIVERY_MEDIUMS from '../../../enum/DELIVERY_MEDIUMS';
import LANGUAGES from '../../../enum/LANGUAGES';
import ROLE from '../../../enum/USER_ROLES';

/**
 * Returns a list of language options for the SelectLanguageField
 * @returns - Array with all available language options
 */
export function availableLanguageOptions(): GenericOption[] {
  return [
    { label: LANGUAGES.DE, value: COUNTRY_CODES.DE },
    { label: LANGUAGES.EN, value: COUNTRY_CODES.EN },
    { label: LANGUAGES.FR, value: COUNTRY_CODES.FR },
    { label: LANGUAGES.IT, value: COUNTRY_CODES.IT },
  ];
}

/**
 * Returns a list of phone number options for the PhoneNumberField
 * @returns - Available phone number options
 * TODO: Customize for specific application
 */
export function availablePhonenNumberOptions(): PhoneCountryCode[] {
  return [
    {
      code: COUNTRY_CODES.CH,
      label: '+41',
      mask: '## ### ## ##',
      value: '+41',
    },
    { code: COUNTRY_CODES.DE, label: '+49', mask: undefined, value: '+49' },
  ];
}

/**
 * Returns a list of all users roles for the corresponding select field
 * @returns - Array with all available user roles
 */
export function availableUserRoles(): GenericOption[] {
  return [
    {
      label: i18n.global.t('fields.authentication.roles.admin'),
      value: ROLE.ADMIN,
    },
    {
      label: i18n.global.t('fields.authentication.roles.user'),
      value: ROLE.USER,
    },
  ];
}

/**
 * Returns the options for how a new user will receive their password, if their
 * account is created by an admin.
 * @returns - Array with all invitation options
 */
export function inviteOptions(): GenericOption[] {
  return [
    {
      label: `${i18n.global.t('fields.authentication.send_email')}`,
      value: [DELIVERY_MEDIUMS.EMAIL],
    },
    {
      label: `${i18n.global.t('fields.authentication.send_sms')}`,
      value: [DELIVERY_MEDIUMS.SMS],
    },
    {
      label: `${i18n.global.t('fields.authentication.send_both')}`,
      value: [DELIVERY_MEDIUMS.EMAIL, DELIVERY_MEDIUMS.SMS],
    },
    {
      label: `${i18n.global.t('fields.authentication.send_custom_email')}`,
      value: [DELIVERY_MEDIUMS.CUSTOM_EMAIL],
    },
    {
      label: `${i18n.global.t('fields.authentication.send_no_invite')}`,
      value: [],
    },
  ];
}
