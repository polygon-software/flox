import Joi, { AnySchema } from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

export type ValidationRule<T = any> = (
  value: T
) => boolean | string | Promise<boolean | string>;

/**
 * Uses joi syntax for generating rules with error messages from i18n
 *
 * @param schema - joi validation schema
 * @param message - i18n message to display in case of error
 * @returns error message
 */
export function joiSchemaToValidationRule(
  schema: AnySchema,
  message: string
): ValidationRule {
  return (val: any) => {
    try {
      Joi.assert(val, schema);
      return true;
    } catch (e) {
      return message;
    }
  };
}

/**
 * Returns a joi email schema
 *
 * @returns Joi schema fitting emails
 */
export function joiEmailSchema(): AnySchema {
  return Joi.string().email({ tlds: { allow: false } });
}

/**
 * Returns Joi schema for username
 *
 * @returns Joi schema fitting usernames
 */
export function joiUsernameSchema(): AnySchema {
  return Joi.string().alphanum().min(10).max(15);
}

/**
 * Returns Joi schema for passwords
 *
 * @returns Joi schema fitting passwords
 */
export function joiPasswordSchema(): AnySchema {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const joiPassword = Joi.extend(joiPasswordExtendCore);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required();
}
