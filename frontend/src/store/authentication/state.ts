import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';

/**
 * Authentication state
 */
class AuthState{
  userSession?: CognitoUserSession = undefined
  userPool?: CognitoUserPool = undefined
  cognitoUser?: CognitoUser = undefined

}

export default AuthState
