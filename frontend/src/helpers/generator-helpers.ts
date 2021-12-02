/**
 * This file contains all helper functions for generating content such as passwords, links, etc.
 */

import ROUTES from 'src/router/routes';

/**
 * Generates a random number in given range
 * @param min
 * @param max
 */
function randomNumber(min:number, max:number) {
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Generates a random password that is valid for AWS Cognito of at least the given length
 * @param {number} min_length
 */
export function randomPassword(min_length: number): string{
  const chars_lower = 'abcdefghijklmnopqrstuvwxyz'
  const chars_upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '[]{}()?-!><:;+='
  const required_chars = [chars_lower, chars_upper, numbers, special]
  let res = ''
  required_chars.forEach((required_char)=>{
    for (let i = 0; i < Math.ceil(min_length/required_chars.length); i++) {
      res += required_char[randomNumber(0, required_char.length)]
    }
  })
  res = res.split('')
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value).join('')
  return res
}

/**
 * Generates a password change link containing base64-encoded e-mail and password for a given user
 * @param {string} email - user's e-mail address
 * @param {string} password - user's password
 * @param {string} type - user's type
 */
export function generatePasswordChangeLink(email: string, password: string, type: string): string{
  // Encode base64
  const hiddenEmail = btoa(email)
  const hiddenPw = btoa(password)

  const baseUrl = process.env.VUE_APP_BASE_URL ??  ''
  return `${baseUrl}${ROUTES.SET_PASSWORD.path}?u=${hiddenEmail}&k=${hiddenPw}&t=${type}`

}
