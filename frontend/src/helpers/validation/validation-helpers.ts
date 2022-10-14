import Joi, {AnySchema} from 'joi';
import {i18n} from 'boot/i18n';
import {ValidationRule} from 'quasar';

/**
 * Uses joi syntax for generating rules with error messages from i18n
 * @param {AnySchema} schema - joi validation schema
 * @param {string} messagePath - i18n message to display in case of error
 * @returns {function} error message
 */
export function joiRule(schema: AnySchema, messagePath: string): ValidationRule {
  return (val: any) => {
    try {
      Joi.assert(val, schema);
      return true;
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return i18n.global.t(messagePath, { val });
    }
  }
}
