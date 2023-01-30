import { randomInt } from 'crypto';

import {
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

// Set up cognito admin provider
const provider = new CognitoIdentityProviderClient({
  region: process.env.AWS_MAIN_REGION ?? 'eu-central-1',
  credentials: {
    accessKeyId: process.env.ADMIN_AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.ADMIN_AWS_SECRET_ACCESS_KEY ?? '',
  },
});

/**
 * Generates a random number in given range
 *
 * @param min - start of the range
 * @param max - end of the range
 * @returns random number in given range
 */
function randomNumber(min: number, max: number): number {
  return randomInt(max - min) + min;
}

/**
 * Generates a random password that is valid for AWS Cognito of at least the given length
 *
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
    .map((value) => ({ value, sort: randomInt(10000) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .join('');
  return res;
}

/**
 * Create a new Cognito Account with the given email address and password.
 *
 * @param {string} email - The email of the new user
 * @param {string|null} password - Initial Password if needed
 * @returns {Promise<Record<string, string>>} - Cognito ID
 */
export async function createCognitoAccount(
  email: string,
  password = null,
): Promise<Record<string, string>> {
  const pw = password || randomPassword(8);
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    TemporaryPassword: pw,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };
  const createUserCommand = new AdminCreateUserCommand(params);
  const resp = await provider.send(createUserCommand);

  // Verfiy e-mail address
  const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
  });
  await provider.send(updateUserAttributesCommand);

  return {
    cognitoId: resp.User.Username,
    password: pw,
  };
}

/**
 * Disables (locks) a cognito account by email
 *
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
 * Deletes a cognito account by email
 *
 * @param {string} email - The account's email
 * @returns {Promise<void>} - done
 */
export async function deleteCognitoAccount(email: string): Promise<void> {
  // Request parameters
  const params = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: email,
  };

  return provider.adminDeleteUser(params, handleOperation);
}

/**
 * Handles Cognito operation
 *
 * @param {Error|undefined} err - errors that occurred
 * @param {unknown|undefined} data - output data
 * @returns {void|unknown} - data, if any
 */
function handleOperation(err: Error | undefined, data: unknown | undefined) {
  if (err) {
    console.error('Cognito error occurred:', err, data);
    throw err;
  }
  return data;
}

/**
 * Checks whether a Cognito account exists for a given e-mail
 *
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
