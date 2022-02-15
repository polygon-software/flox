import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

// Set up cognito admin provider
const provider = new CognitoIdentityProvider({
  region: process.env.AWS_REGION ?? 'eu-central-1',
});

/**
 * Create a new Cognito Account with the given email address and password.
 * @param {string} email - The email of the new user
 * @param {string} password - The password of the new user
 * @returns {string} - Cognito ID
 */
export async function createCognitoAccount(
  email: string,
  password: string,
): Promise<string> {
  // Set up authentication user pool
  const poolSettings = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    ClientId: process.env.USER_POOL_CLIENT_ID ?? '',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings);
  const cognitoUserWrapper: ISignUpResult = await new Promise(
    (resolve, reject) => {
      const attributes = [];
      attributes.push(
        new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
      );
      userPool.signUp(
        email,
        password,
        attributes,
        [],
        (err?: Error, result?: ISignUpResult) => {
          if (err) {
            reject(err);
          }
          if (result) {
            resolve(result);
          }
        },
      );
    },
  );
  return cognitoUserWrapper.userSub;
}

/**
 * Disables (locks) a cognito account by username
 * @param {string} username - The account's username
 * @returns {Promise<void>} - done
 */
export async function disableCognitoAccount(username: string): Promise<void> {
  // Request parameters
  const params = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: username,
  };

  return provider.adminDisableUser(params, handleOperation);
}

/**
 * Enables a cognito account by username
 * @param {string} username - The account's username
 * @returns {Promise<void>} - done
 */
export async function enableCognitoAccount(username: string): Promise<void> {
  // Request parameters
  const params = {
    UserPoolId: process.env.USER_POOL_ID ?? '',
    Username: username,
  };

  return provider.adminEnableUser(params, handleOperation);
}

/**
 * Handles Cognito operation
 * @param {Error|undefined} err - errors that occurred
 * @param {unknown|undefined} data - output data
 * @returns {void}
 */
function handleOperation(err: Error | undefined, data: unknown | undefined) {
  if (err) {
    throw err;
  }
  return data;
}
