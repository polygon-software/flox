import { randomInt } from 'crypto';

import shuffle from 'lodash/shuffle';
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandOutput,
  AdminDisableUserCommand,
  AdminDisableUserCommandOutput,
  AdminEnableUserCommand,
  AdminEnableUserCommandOutput,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { isEmail } from 'class-validator';

import Env from '../../../../env';

// Default length for Cognito passwords
const MINIMUM_COGNITO_PASSWORD_LENGTH = 8;
const DEFAULT_COGNITO_PASSWORD_LENGTH = 16;

// Set up cognito admin provider
const provider = new CognitoIdentityProviderClient({
  region: Env.AWS_MAIN_REGION,
  credentials: {
    accessKeyId: Env.AWS_ADMIN_ACCESS_KEY_ID,
    secretAccessKey: Env.AWS_ADMIN_SECRET_ACCESS_KEY,
  },
});

/**
 * Available auto-delivery mediums for new user's login information
 */
export enum DeliveryMedium {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

/**
 * Generates a random number in given range
 *
 * @param min - start of the range (inclusive)
 * @param max - end of the range (exclusive)
 * @returns random number in given range
 */
function randomNumber(min: number, max: number): number {
  return randomInt(min, max);
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
  const specialCharacters = '!?+'; // Limited to known working characters due to base-64 encoding
  const requiredChars = [charsLower, charsUpper, numbers, specialCharacters];
  let password = '';
  requiredChars.forEach((requiredChar) => {
    for (let i = 0; i < Math.ceil(minLength / requiredChars.length); i += 1) {
      password += requiredChar[randomNumber(0, requiredChar.length)];
    }
  });
  // Note that the shuffle method is not cryptographically secure, but not problematic since the characters themselves are randomized as well
  // (and this is usually used for temporary passwords only)
  password = shuffle(password.split('')).join('');
  return password;
}

/**
 * Create a new Cognito Account with the given email address and password.
 *
 * @param email - The email of the new user
 * @param [password] - Initial password, if needed (random if not given)
 * @param [deliveryMedium] - medium to use to deliver user's new login information (sms, email, both or none)
 * @param [verified] - whether to mark the user's e-mail as verified
 * @returns Cognito ID
 */
export async function createCognitoAccount(
  email: string,
  password?: string,
  deliveryMedium = DeliveryMedium.EMAIL,
  verified = true,
): Promise<{ cognitoUuid: string; password: string }> {
  // Ensure password satisfies minimum length requirement
  if (!!password && password.length < MINIMUM_COGNITO_PASSWORD_LENGTH) {
    throw new Error(
      `Password failed to satisfy minimum length constraint (length: ${password.length})`,
    );
  }

  // Ensure e-mail is valid
  if (!isEmail(email)) {
    throw new Error(`${email} is not a valid e-mail address`);
  }

  const pw = password || randomPassword(DEFAULT_COGNITO_PASSWORD_LENGTH);

  let mediums: string[] = [];
  switch (deliveryMedium) {
    case DeliveryMedium.SMS:
      mediums = ['SMS'];
      break;
    case DeliveryMedium.EMAIL:
      mediums = ['EMAIL'];
      break;
    case DeliveryMedium.BOTH:
      mediums = ['EMAIL', 'SMS'];
      break;
    default:
      break;
  }

  const params = {
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
    TemporaryPassword: pw,
    DesiredDeliveryMediums: mediums,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };
  const createUserCommand = new AdminCreateUserCommand(params);
  const resp = await provider.send(createUserCommand);

  // Ensure user was created successfully, otherwise throw with request ID for traceability
  if (!resp.User || !resp.User.Username) {
    throw new Error(
      `An error occurred while creating the Cognito user. Request ID: ${
        resp.$metadata.requestId ?? '-'
      }`,
    );
  }

  // Mark e-mail address as verified
  const updateUserAttributesCommand = new AdminUpdateUserAttributesCommand({
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
    UserAttributes: [
      { Name: 'email_verified', Value: verified ? 'true' : 'false' },
    ],
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
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
  });
  return provider.send(disableUserCommand);
}

/**
 * Re-enables (unlocks) a cognito account by email
 *
 * @param email - The account's email
 * @returns command output
 */
export function enableCognitoAccount(
  email: string,
): Promise<AdminEnableUserCommandOutput> {
  const enableUserCommand = new AdminEnableUserCommand({
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
  });
  return provider.send(enableUserCommand);
}

/**
 * Determines whether a user's account is currently enabled
 *
 * @param email - The account's email
 * @returns true if the account is enabled, false if it is disabled
 */
export async function isUserEnabled(email: string): Promise<boolean> {
  const getUserCommand = new AdminGetUserCommand({
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
  });
  const result = await provider.send(getUserCommand);

  return result.Enabled ?? false;
}

/**
 * Determines a user's account status
 *
 * @param email - The account's email
 * @returns true if the account is enabled, false if it is disabled
 */
export async function getAccountStatus(email: string): Promise<UserStatusType> {
  const getUserCommand = new AdminGetUserCommand({
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
  });
  const result = await provider.send(getUserCommand);

  const status = result?.UserStatus;

  // If status is of type string (not UserStatusType), return as unknown
  return status && status in UserStatusType
    ? (status as UserStatusType)
    : UserStatusType.UNKNOWN;
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
    UserPoolId: Env.USER_POOL_ID,
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
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
  };

  const getUserCommand = new AdminGetUserCommand(params);
  const result = await provider.send(getUserCommand);

  return !!result.Username;
}

/**
 * Forces a user to change their password by setting a temporary password for them, forcing them into
 * FORCE_CHANGE_PASSWORD state. It is suggested to provide the new temporary password to the user via e-mail from the
 * service that called this function.
 *
 * @param email - The email of the new user
 * @returns the temporary password that was set for the user
 */
export async function forceUserPasswordChange(email: string): Promise<string> {
  const tempPassword = randomPassword(DEFAULT_COGNITO_PASSWORD_LENGTH);
  // Request parameters
  const params = {
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
    Password: tempPassword,
    Permanent: false,
  };

  const setPasswordCommand = new AdminSetUserPasswordCommand(params);
  const result = await provider.send(setPasswordCommand);

  // Globally sign out user
  await provider.send(
    new AdminUserGlobalSignOutCommand({
      UserPoolId: Env.USER_POOL_ID,
      Username: email,
    }),
  );

  // If status code is anything other than 200, throw error
  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(
      `An error occurred while resetting the user's password: Status Code ${
        result?.$metadata.httpStatusCode ?? '-'
      }, request ID ${result?.$metadata.requestId ?? '-'}`,
    );
  }

  return tempPassword;
}
