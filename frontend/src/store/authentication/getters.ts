import AuthState from './state';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import { Getters } from 'vuex-smart-module'

/**
 * Getters
 */
class AuthGetters extends Getters<AuthState> {

  /**
   * Gets logged in status
   * @returns {boolean} - whether the user is logged in
   */
  getLoggedInStatus(): boolean {
    return this.state.userSession?.isValid() ?? false
  }

  /**
   * Gets the cognito user
   * @returns {CognitoUser|undefined} - the currently logged in user, if any
   */
  getCognitoUser(): CognitoUser|undefined {
    return  this.state.cognitoUser
  }

  /**
   * Gets the current user's username, if any
   * @returns {string|undefined} - username, if any
   */
  getUsername(): string|undefined {
    return this.state.cognitoUser?.getUsername()
  }

  /**
   * Gets the current user's cognito session
   * @returns {CognitoUserSession|undefined} - user session, if any
   */
  getUserSession(): CognitoUserSession|undefined {
    return  this.state.userSession
  }

  /**
   * Returns the current cognito user pool, if any
   * @returns {CognitoUserPool|undefined} - user pool, if any
   */
  getUserPool(): CognitoUserPool|undefined {
    return  this.state.userPool
  }

}

export default AuthGetters;
