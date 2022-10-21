import {QInput, QInputProps, ValidationRule} from 'quasar'
import PasswordRepeat from 'src/flox/modules/auth/components/forms/fields/PasswordRepeat.vue'
import Password from 'src/flox/modules/auth/components/forms/fields/Password.vue'
import {markRaw} from 'vue';
import {i18n} from 'boot/i18n.boot';
import {
  joiEmailSchema, joiPasswordSchema,
  joiSchemaToValidationRule,
  joiUsernameSchema
} from 'src/tools/validation.tool';

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

export interface Field<ComponentProps = any> {
  key: string,
  component: any,
  attributes: { rules: ValidationRule[] } & (Omit<ComponentProps, 'modelValue'>),
}

const EMAIL: Field<QInputProps> = {
  key: 'email',
  component: markRaw(QInput),
  attributes: {
    dense: true,
    type: 'email',
    label: i18n.global.t('authentication.email'),
    lazyRules: 'ondemand',
    rules: [joiSchemaToValidationRule(joiEmailSchema(),'errors.invalid_email')]
  },
}

const USERNAME: Field<QInputProps> = {
  key: 'username',
  component: markRaw(QInput),
  attributes: {
    dense: true,
    type: 'text',
    label: i18n.global.t('authentication.username'),
    lazyRules: 'ondemand',
    rules: [joiSchemaToValidationRule(joiUsernameSchema(), 'errors.invalid_username')]
  },
}

const PASSWORD: Field = {
  key: 'password',
  component: markRaw(Password),
  attributes: {
    rules: [joiSchemaToValidationRule(joiPasswordSchema(), i18n.global.t('errors.invalid_password'))],
  }
}

const PASSWORD_REPEAT: Field = {
  key: 'password_repeat',
  component: markRaw(PasswordRepeat),
  attributes: {
    rules: [joiSchemaToValidationRule(joiPasswordSchema(), i18n.global.t('errors.invalid_password'))]
  }
}

const FIELDS: Record<string, Field<any>> = {
        EMAIL,
        USERNAME,
        PASSWORD,
        PASSWORD_REPEAT,
    }

export {FIELDS}
