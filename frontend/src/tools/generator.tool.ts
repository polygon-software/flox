/**
 * This file contains all helper functions for generating content such as passwords, links, etc.
 */

/**
 * Generates a random integer in given range
 *
 * @param min - minimum
 * @param max - maximum
 * @returns a random number
 */
export function randomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Generates a random password that is valid for AWS Cognito of at least the given length
 *
 * @param minLength - minimum length
 * @returns the random password
 */
export function randomPassword(minLength: number): string {
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '[]{}()?-!><:;+=';
  const requiredChars = [charsLower, charsUpper, numbers, special];
  let res = '';
  requiredChars.forEach((requiredChar) => {
    for (let i = 0; i < Math.ceil(minLength / requiredChars.length); i += 1) {
      res += requiredChar[randomNumber(0, requiredChar.length)];
    }
  });
  res = res
    .split('')
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .join('');
  return res;
}
