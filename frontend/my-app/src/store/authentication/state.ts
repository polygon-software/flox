import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';

export interface AuthStateInterface {
  userSession?: CognitoUserSession,
  cognitoUser?: CognitoUser
}

function state(): AuthStateInterface {
  return {
    userSession: undefined,
    cognitoUser: undefined
  }
};

export default state;
