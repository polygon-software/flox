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
  SignUpCommand,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import { isEmail } from 'class-validator';
import RandExp from 'randexp';

import Env from '../../../../env';
import { PASSWORD_REGEX } from '../../../REGEX';
import DELIVERY_MEDIUMS from '../../../enum/DELIVERY_MEDIUMS';

// Minimum length for Cognito passwords
const MINIMUM_COGNITO_PASSWORD_LENGTH = 8;

// Set up cognito admin provider
const provider = new CognitoIdentityProviderClient({
  region: Env.AWS_MAIN_REGION,
  credentials: {
    accessKeyId: Env.AWS_ADMIN_ACCESS_KEY_ID,
    secretAccessKey: Env.AWS_ADMIN_SECRET_ACCESS_KEY,
  },
});

/**
 * Signup a new Cognito Account.
 *
 * @param username - The username of the new user
 * @param email - The email of the new user
 * @param password - Initial password
 * @param [phoneNumber] - user's phone number (needed if sms was selected)
 * @returns Cognito ID
 */
export async function signupCreateCognitoAccount(
  username: string,
  email: string,
  password: string,
  phoneNumber?: string,
): Promise<string> {
  // Ensure password satisfies minimum length requirement
  if (password.length < MINIMUM_COGNITO_PASSWORD_LENGTH) {
    throw new Error(
      `Password failed to satisfy minimum length constraint (length: ${password.length})`,
    );
  }

  // Ensure e-mail is valid
  if (!isEmail(email)) {
    throw new Error(`${email} is not a valid e-mail address`);
  }

  const userAttrs = [
    {
      Name: 'email',
      Value: email,
    },
  ];

  if (phoneNumber) {
    userAttrs.push({
      Name: 'phone_number',
      Value: phoneNumber,
    });
  }

  const params = {
    ClientId: Env.USER_POOL_CLIENT_ID,
    Username: username,
    Password: password,
    TemporaryPassword: password,
    UserAttributes: userAttrs,
  };
  const signupCommand = new SignUpCommand(params);
  const resp = await provider.send(signupCommand);

  // Ensure user was created successfully, otherwise throw with request ID for traceability
  if (!resp.UserSub) {
    throw new Error(
      `An error occurred while creating the Cognito user. Request ID: ${
        resp.$metadata.requestId ?? '-'
      }`,
    );
  }
  return resp.UserSub;
}

/**
 * Create a new Cognito Account..
 *
 * @param username - The username of the new user
 * @param email - The email of the new user
 * @param password - Initial password
 * @param [phoneNumber] - user's phone number (needed if sms was selected)
 * @param [deliveryMediums] - medium to use to deliver user's new login information (sms, email, both or none)
 * @returns Cognito ID
 */
export async function adminCreateCognitoAccount(
  username: string,
  email: string,
  password: string,
  phoneNumber?: string,
  deliveryMediums: DELIVERY_MEDIUMS[] = [],
): Promise<string> {
  // Ensure password satisfies minimum length requirement
  if (password.length < MINIMUM_COGNITO_PASSWORD_LENGTH) {
    throw new Error(
      `Password failed to satisfy minimum length constraint (length: ${password.length})`,
    );
  }

  // Ensure e-mail is valid
  if (!isEmail(email)) {
    throw new Error(`${email} is not a valid e-mail address`);
  }

  const userAttrs = [
    {
      Name: 'email',
      Value: email,
    },
  ];

  if (phoneNumber) {
    userAttrs.push({
      Name: 'phone_number',
      Value: phoneNumber,
    });
  }

  const params = {
    UserPoolId: Env.USER_POOL_ID,
    Username: email,
    TemporaryPassword: password,
    DesiredDeliveryMediums: deliveryMediums,
    UserAttributes: userAttrs,
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
    Username: username,
    UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
  });
  await provider.send(updateUserAttributesCommand);

  return resp.User.Username;
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
 * FORCE_CHANGE_PASSWORD state. It is required to provide the new temporary password to the user via e-mail from the
 * service that called this function.
 *
 * @param email - The email of the user
 * @returns the temporary password that was set for the user
 */
export async function forceUserPasswordChange(email: string): Promise<string> {
  const randExp = new RandExp(PASSWORD_REGEX);
  randExp.max = 16;
  const tempPassword = randExp.gen(); // Request parameters
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
