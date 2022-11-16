import { QInput, QInputProps } from 'quasar';
import { markRaw } from 'vue';

import { i18n } from 'boot/i18n';
import Password from 'src/flox/modules/auth/components/forms/fields/PasswordInput.vue';
import PasswordRepeat from 'src/flox/modules/auth/components/forms/fields/PasswordRepeat.vue';
import {
  joiEmailSchema,
  joiPasswordSchema,
  joiSchemaToValidationRule,
  joiUsernameSchema,
  ValidationRule,
} from 'src/tools/validation.tool';

/**
 * This file contains bootstrap configurations for sign up and sign in input fields. With these, the corresponding forms can be built modularly.
 *
 * Required attributes
 *
 * @param key - Unique identifier
 * @param  component - A Vue component, which may also be custom. Must be marked as raw using 'markRaw'
 *
 * Optional attributes
 * @param  type - A quasar type
 * @param  label - The fields displayed name
 * @param  lazy_rules - Check at https://quasar.dev/vue-components/input
 * @param  rules - Rules that get applied to the input field, e.g. to check if a password is valid.
 */
export interface Field<ComponentType = any, ComponentProps = any> {
  key: string;
  component: ComponentType;
  prependIcon?: string;
  appendIcon?: string;
  attributes: { rules: ValidationRule[] } & Omit<ComponentProps, 'modelValue'>;
}

export const EMAIL: Field<typeof QInput, QInputProps> = {
  key: 'email',
  component: markRaw(QInput),
  prependIcon: 'email',
  attributes: {
    dense: true,
    rounded: true,
    outlined: true,
    type: 'email',
    label: i18n.global.t('authentication.email'),
    lazyRules: 'ondemand',
    rules: [
      joiSchemaToValidationRule(
        joiEmailSchema(),
        i18n.global.t('errors.invalid_email')
      ),
    ],
  },
};

export const USERNAME: Field<typeof QInput, QInputProps> = {
  key: 'username',
  component: markRaw(QInput),
  prependIcon: 'account',
  attributes: {
    dense: true,
    rounded: true,
    outlined: true,
    type: 'text',
    label: i18n.global.t('authentication.username'),
    lazyRules: 'ondemand',
    rules: [
      joiSchemaToValidationRule(
        joiUsernameSchema(),
        i18n.global.t('errors.invalid_username')
      ),
    ],
  },
};

export const PASSWORD: Field<typeof Password, QInputProps> = {
  key: 'password',
  component: markRaw(Password),
  attributes: {
    rounded: true,
    outlined: true,
    rules: [
      joiSchemaToValidationRule(
        joiPasswordSchema(),
        i18n.global.t('errors.invalid_password')
      ),
    ],
  },
};

export const PASSWORD_REPEAT: Field<typeof PasswordRepeat, QInputProps> = {
  key: 'password_repeat',
  component: markRaw(PasswordRepeat),
  attributes: {
    rules: [
      joiSchemaToValidationRule(
        joiPasswordSchema(),
        i18n.global.t('errors.invalid_password')
      ),
    ],
  },
};

export const FIELDS = {
  EMAIL,
  USERNAME,
  PASSWORD,
  PASSWORD_REPEAT,
};
