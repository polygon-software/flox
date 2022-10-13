// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { email } from '@vuelidate/validators/dist/raw.esm';
import { i18n } from 'boot/i18n';

type validationFunction = (val: any) => boolean

/**
 * Validates an email
 * @returns {function} Validation function
 */
export function isEmail(): (val: string) => true | string {
  return (val: string): true | string => (email as validationFunction)(val) || i18n.global.t('validation.email');
}
