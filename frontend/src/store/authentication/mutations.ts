import AuthState  from './state';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import {deleteCookies, persistToCookies} from 'src/helpers/tools/cookie-helpers'
import { Mutations } from 'vuex-smart-module'

/**
 * Auth mutations
 */
class AuthMutations extends Mutations<AuthState>{
  /**
   * Sets the current user session
   * @param {CognitoUserSession|undefined} payload - value to set
   * @returns {void}
   */
  setUserSession(payload: CognitoUserSession|undefined): void {
    this.state.userSession = payload

    if(this.state.userSession) {
      // Persist tokens to cookies
      const idToken = this.state.userSession.getIdToken().getJwtToken()
      const refreshToken = this.state.userSession.getRefreshToken().getToken()
      const accessToken = this.state.userSession.getAccessToken().getJwtToken()
      persistToCookies(
        'authentication',
        {
          idToken,
          refreshToken,
          accessToken
        }
      )
    } else {
      deleteCookies('authentication')
    }
  }

  /**
   * Sets the user pool
   * @param {CognitoUserPool|undefined} payload - value to set
   * @returns {void}
   */
  setUserPool(payload: CognitoUserPool|undefined): void {
    this.state.userPool = payload
  }

  /**
   * Sets the cognito user
   * @param {CognitoUser|undefined} payload - value to set
   * @returns {void}
   */
  setCognitoUser(payload: CognitoUser|undefined): void {
    this.state.cognitoUser = payload
  }
}

export default AuthMutations;
