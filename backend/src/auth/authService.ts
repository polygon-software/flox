import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { ISignUpResult } from 'amazon-cognito-identity-js';

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
