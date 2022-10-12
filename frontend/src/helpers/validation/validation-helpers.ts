import { email } from '@vuelidate/validators/dist/raw.esm';
import { i18n } from 'boot/i18n';

/**
 * Validates an email
 * @returns {function} Validation function
 */
export function isEmail(): (val: string) => true | string {
  return (val: string) => email(val) || i18n.global.t('validation.email');
}
