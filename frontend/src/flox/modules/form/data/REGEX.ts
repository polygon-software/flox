export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$ %^&*-]).{8,}$/;
export const EMAIL_REGEX = /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/;
export const ZIP_REGEX = /^\d{4}$/;
export const PHONE_NUMBER_REGEX = /^((\+41\d{9})|(\+423\d{7}))$/;
export const IBAN_REGEX = /^[A-Z]{2}\d{2}( [A-Z0-9]{4}){4} [A-Z0-9]$/;
export const MONTH_DATE_REGEX = /^(0(1-9)|10|11|12)\/(19|20)\d{2}$/;
export const TIME_REGEX = /^([0-1]?\d|2[0-3]):[0-5]\d$/;
export const URL_REGEX =
  /^[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
