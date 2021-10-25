import {EMAIL_REGEX, PASSWORD_REGEX} from "@/helpers/REGEX";
import {QInput} from "quasar"
import PasswordRepeat from "./PasswordRepeat.vue"

export const SIGNUP = {
        EMAIL: {
            key: "email",
            component: QInput,
            attributes: {
                type: "email",
                label: "E-Mail",

                lazy_rules: "ondemand",
                rules: [(val: string) => EMAIL_REGEX.test(val) || 'Please enter a valid e-mail address.']
            },
        },
        USERNAME: {
            key: "username",
            component: QInput,
            attributes: {
                type: "text",
                label: "Username",
                lazy_rules: "true",
                rules: [(val: string) => val && val.length > 0 || 'Please enter a username']
            },

        },
        PASSWORD: {
            key: "password",
            component: QInput,
            attributes: {
                type: "password",
                label: "Password",
                lazy_rules: "ondemand",
                rules: [(val: string) => PASSWORD_REGEX.test(val) || 'Your password must consist of...']
            },
        },
        PASSWORD_REPEAT: {
            key: "passwordRepeat",
            component: PasswordRepeat,
            attributes: {
            }
        },
    }
