import {IS_EMAIL, IS_VALID_PASSWORD, IS_VALID_STRING} from './RULES'
import {QInput} from 'quasar'
import PasswordRepeat from 'components/forms/fields/PasswordRepeat.vue'
import Password from 'components/forms/fields/Password.vue'
import {markRaw} from 'vue';

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
    rules: Array<(valueElement: any) => boolean|string>
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
              label: 'E-Mail',
              lazy_rules: 'ondemand',
              rules: [(val: string): boolean|string  => IS_EMAIL(val) || 'Please enter a valid e-mail address.']
            },
        },
        USERNAME: {
            key: 'username',
            component: markRaw(QInput),
            attributes: {
              dense: true,
              type: 'text',
              label: 'Username',
              lazy_rules: 'true',
              rules: [(val: string): boolean|string => IS_VALID_STRING(val) || 'Please enter a username']
            },
        },
        PASSWORD: {
            key: 'password',
            component: markRaw(Password),
            attributes: {
              rules: [(val: string): boolean|string => IS_VALID_STRING(val) || 'Please enter a username']
            }
        },
        PASSWORD_REPEAT: {
            key: 'password_repeat',
            component: markRaw(PasswordRepeat),
            attributes: {
              rules: [(val: string): boolean|string  => IS_VALID_PASSWORD(val) || 'Please enter a valid password']
            }
        },
        FULL_NAME: {
          key: 'full_name',
          component: markRaw(QInput),
          attributes: {
            dense: true,
            type: 'text',
            label: 'Full name',
            lazy_rules: 'true',
            rules: [(val: string): boolean|string  => IS_VALID_STRING(val) || 'Please enter your full name']
          },

        },
    }

export {FIELDS}
