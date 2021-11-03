import AuthState from './state';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import { Getters } from 'vuex-smart-module'

// Getters
class AuthGetters extends Getters<AuthState> {

  getLoggedInStatus (): boolean {
    return this.state.userSession?.isValid() ?? false
  }

  getCognitoUser (): CognitoUser|undefined {
    return  this.state.cognitoUser
  }

  getUsername (): string|undefined {
    return this.state.cognitoUser?.getUsername()
  }

  getUserSession (): CognitoUserSession|undefined {
    return  this.state.userSession
  }

  getUserPool (): CognitoUserPool|undefined {
    return  this.state.userPool
  }

}

export default AuthGetters;
