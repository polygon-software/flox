import { ValidationRule } from '../../../../tools/validation.tool';

/**
 * Generates a Quasar validation rule from a class-validator one.
 * @param validationRule - the rule which should be applied
 * @param errorMessage - message to display in case validation fails
 * @param options - additional arguments for the validator function
 * @returns - the new validation rule
 */
// eslint-disable-next-line import/prefer-default-export
export function classValidatorRule(
  validationRule: (val: any, options?: any) => boolean,
  errorMessage: string,
  options?: any
): ValidationRule {
  return (val: any) => {
    return validationRule(val, options) || errorMessage;
  };
}
