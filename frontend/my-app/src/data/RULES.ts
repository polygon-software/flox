import {EMAIL_REGEX, PASSWORD_REGEX} from "@/helpers/REGEX";

/**
 * This file contains rules that can be applied to input forms.
 */

/**
* Form field Rules
 */
const IS_EMAIL = (val: string) => EMAIL_REGEX.test(val)
const IS_VALID_USERNAME = (val: string) => val && val.length > 0
const IS_VALID_PASSWORD = (val: string) => PASSWORD_REGEX.test(val)

export {IS_EMAIL, IS_VALID_USERNAME, IS_VALID_PASSWORD}
