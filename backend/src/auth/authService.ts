import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import * as crypto from 'crypto';
// Set up cognito admin provider
const provider = new CognitoIdentityProvider({
  region: process.env.AWS_REGION ?? 'eu-central-1',
});

/**
 * Create a new Cognito Account with the given email address and password.
 * @param {string} email - The email of the new user
 * @param {string|null} password - Initial Password if needed
 * @returns {Promise<Record<string, string>>} - Cognito ID
 */
export async function createCognitoAccount(
  email: string,
  password = null,
): Promise<Record<string, string>> {
  const pw = randomPassword(8);
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    TemporaryPassword: password || pw,
    UserAttributes: [],
  };
  const resp = await provider.adminCreateUser(params);
  return {
    cognitoId: resp.User.Username,
    password: pw,
  };
}
/**
 * Generates a random number in given range
 * @param {number} min - start of the range
 * @param {number} max - end of the range
 * @returns {number} - a random number
 */
function randomNumber(min: number, max: number) {
  return crypto.randomInt(max - min) + min;
}
/**
 * Generates a random password that is valid for AWS Cognito of at least the given length
 * @param {number} minLength - min length
 * @returns {string} - a random string
 */
export function randomPassword(minLength: number): string {
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!?+'; // Limited to known working characters due to base-64 encoding
  const requiredChars = [charsLower, charsUpper, numbers, special];
  let res = '';
  requiredChars.forEach((requiredChar) => {
    for (let i = 0; i < Math.ceil(minLength / requiredChars.length); i++) {
      res += requiredChar[randomNumber(0, requiredChar.length)];
    }
  });
  res = res
    .split('')
    .map((value) => ({ value, sort: crypto.randomInt(10000) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .join('');
  return res;
}

/**
 * Disables (locks) a cognito account by email
 * @param {string} email - The account's email
 * @returns {Promise<void>} - done
 */
export async function disableCognitoAccount(email: string): Promise<void> {
  // Request parameters
  const params = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: email,
  };

  return provider.adminDisableUser(params, handleOperation);
}

/**
 * Handles Cognito operation
 * @param {Error|undefined} err - errors that occurred
 * @param {unknown|undefined} data - output data
 * @returns {void|unknown} - data, if any
 */
function handleOperation(err: Error | undefined, data: unknown | undefined) {
  if (err) {
    console.log('Error is', err);
    throw err;
  }
  return data;
}

/**
 * Checks whether a Cognito account exists for a given e-mail
 * @param {string} email - The email of the new user
 * @returns {Promise<boolean>} - whether the user already exists
 */
export async function checkIfUserExists(email: string): Promise<boolean> {
  // Request parameters
  const params = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: email,
  };

  const existingUser = await new Promise((resolve) => {
    provider.adminGetUser(params, function (err) {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });

  return !!existingUser;
}
