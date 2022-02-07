export const PASSWORD_REGEX = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')
export const PASSWORD_MIN_LENGTH = new RegExp('^.{8,}$')
export const EMAIL_REGEX = new RegExp('^[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+$')
