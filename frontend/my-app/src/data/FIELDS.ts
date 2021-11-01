import {IS_EMAIL, IS_VALID_PASSWORD, IS_VALID_STRING} from './RULES'
import {QInput} from 'quasar'
import PasswordRepeat from 'components/forms/fields/PasswordRepeat.vue'
import Password from 'components/forms/fields/Password.vue'
import {shallowRef} from 'vue';

/**
 * This file contains bootstrap configurations for sign up and sign in input fields. With these, the corresponding forms can be built modularly.
 *
 * Required attributes
 * @key: Unique identifier
 * @component: A vue component. Can be custom.
 *
 * Optional attributes
 * @type: A quasar type
 * @label: The fields displayed name
 * @lazy_rules: Check at https://quasar.dev/vue-components/input
 * @rules: Rules that get applied to the input field, e.g. to check if a password is valid.
 */

const FIELDS: Record<string, Record<string, any>> = {
        EMAIL: {
            key: 'email',
            component: shallowRef(QInput),
            attributes: {
                type: 'email',
                label: 'E-Mail',
                lazy_rules: 'ondemand',
                rules: [(val: string) => IS_EMAIL(val) || 'Please enter a valid e-mail address.']
            },
        },
        USERNAME: {
            key: 'username',
            component: shallowRef(QInput),
            attributes: {
                type: 'text',
                label: 'Username',
                lazy_rules: 'true',
                rules: [(val: string) => IS_VALID_STRING(val) || 'Please enter a username']
            },
        },
        PASSWORD: {
            key: 'password',
            component: shallowRef(Password),
            attributes: {}
        },
        PASSWORD_REPEAT: {
            key: 'password_repeat',
            component: shallowRef(PasswordRepeat),
            attributes: {
              rules: [(val: string) => IS_VALID_PASSWORD(val) || 'Please enter a valid password']
            }
        },
        FULL_NAME: {
          key: 'full_name',
          component: shallowRef(QInput),
          attributes: {
            type: 'text',
            label: 'Full name',
            lazy_rules: 'true',
            rules: [(val: string) => IS_VALID_STRING(val) || 'Please enter your full name']
          },

        },
    }

export {FIELDS}
