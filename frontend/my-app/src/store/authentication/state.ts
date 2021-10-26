import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';

export interface AuthStateInterface {
  userSession?: CognitoUserSession,
  userPool?: CognitoUserPool,
  cognitoUser?: CognitoUser,
}

function state(): AuthStateInterface {
  return {
    userSession: undefined,
    userPool: undefined,
    cognitoUser: undefined
  }
};

export default state;
