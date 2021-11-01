import {IS_EMAIL, IS_VALID_USERNAME} from './RULES'
import {QInput} from 'quasar'
import PasswordRepeat from 'components/forms/fields/PasswordRepeat.vue'
import Password from 'components/forms/fields/Password.vue'

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
            component: QInput,
            attributes: {
                type: 'email',
                label: 'E-Mail',
                lazy_rules: 'ondemand',
                rules: [(val: string) => IS_EMAIL(val) || 'Please enter a valid e-mail address.']
            },
        },
        USERNAME: {
            key: 'username',
            component: QInput,
            attributes: {
                type: 'text',
                label: 'Username',
                lazy_rules: 'true',
                rules: [(val: string) => IS_VALID_USERNAME(val) || 'Please enter a username']
            },

        },
        PASSWORD: {
            key: 'password',
            component: Password,
        },
        PASSWORD_REPEAT: {
            key: 'passwordRepeat',
            component: PasswordRepeat,
            attributes: {
            }
        },
    }

export {FIELDS}
