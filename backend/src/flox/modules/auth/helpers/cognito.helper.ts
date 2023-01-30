import { randomInt } from 'crypto';

import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandOutput,
  AdminDisableUserCommand,
  AdminDisableUserCommandOutput,
  AdminGetUserCommand,
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
 * @param minLength - min length
 * @returns a random string
 */
export function randomPassword(minLength: number): string {
  const charsLower = 'abcdefghijklmnopqrstuvwxyz';
  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!?+'; // Limited to known working characters due to base-64 encoding
  const requiredChars = [charsLower, charsUpper, numbers, special];
  let res = '';
  requiredChars.forEach((requiredChar) => {
    for (let i = 0; i < Math.ceil(minLength / requiredChars.length); i += 1) {
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
 * @param email - The email of the new user
 * @param password - Initial Password if needed
 * @returns Cognito ID
 */
export async function createCognitoAccount(
  email: string,
  password = null,
): Promise<{ cognitoUuid: string; password: string }> {
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

  if (!resp.User || !resp.User.Username) {
    throw new Error(
      `An error occurred while creating the Cognito user. Request ID: ${
        resp.$metadata.requestId ?? '-'
      }`,
    );
  }

  // Mark e-mail address as verified
  const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
  });
  await provider.send(updateUserAttributesCommand);

  return {
    cognitoUuid: resp.User.Username,
    password: pw,
  };
}

/**
 * Disables (locks) a cognito account by email
 *
 * @param email - The account's email
 * @returns command output
 */
export function disableCognitoAccount(
  email: string,
): Promise<AdminDisableUserCommandOutput> {
  const disableUserCommand = new AdminDisableUserCommand({
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: email,
  });
  return provider.send(disableUserCommand);
}

/**
 * Deletes a cognito account by email
 *
 * @param email - The account's email
 * @returns command output
 */
export function deleteCognitoAccount(
  email: string,
): Promise<AdminDeleteUserCommandOutput> {
  const deleteUserCommand = new AdminDeleteUserCommand({
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: email,
  });
  return provider.send(deleteUserCommand);
}

/**
 * Checks whether a Cognito account exists for a given e-mail
 *
 * @param email - The email of the new user
 * @returns whether the user already exists
 */
export async function checkIfUserExists(email: string): Promise<boolean> {
  // Request parameters
  const params = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: email,
  };

  const getUserCommand = new AdminGetUserCommand(params);
  const result = await provider.send(getUserCommand);

  return !!result.Username;
}
