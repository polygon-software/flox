import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import * as crypto from 'crypto';

/**
 * Create a new Cognito Account with the given email address and password.
 * @param {string} email - The email of the new user
 * @param {string} password - The password of the new user
 * @return {string} - Cognito ID
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
 * Generates a random number in given range
 * @param {number} min - start of the range
 * @param {number} max - end of the range
 * @return {number} - a random number
 */
function randomNumber(min: number, max: number) {
  return crypto.randomInt(max - min) + min;
}

/**
 * Generates a random password that is valid for AWS Cognito of at least the given length
 * @param {number} min_length - min length
 * @returns {string} - a random string
 */
export function randomPassword(min_length: number): string {
  const chars_lower = 'abcdefghijklmnopqrstuvwxyz';
  const chars_upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '[]{}()?-!><:;+=';
  const required_chars = [chars_lower, chars_upper, numbers, special];
  let res = '';
  required_chars.forEach((required_char) => {
    for (let i = 0; i < Math.ceil(min_length / required_chars.length); i++) {
      res += required_char[randomNumber(0, required_char.length)];
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
