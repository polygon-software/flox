import { defineStore } from 'pinia';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import {deleteCookies, persistToCookies} from 'src/flox/modules/auth/tools/cookie.helpers';

export interface AuthState {
  userSession: CognitoUserSession | undefined
  userPool: CognitoUserPool | undefined
  cognitoUser: CognitoUser | undefined
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    userSession: undefined,
    userPool: undefined,
    cognitoUser: undefined
  }),

  getters: {
    /**
     * Gets logged in status
     * @param {AuthState} state - the current state of the store
     * @returns {boolean} - whether the user is logged in
     */
    getLoggedInStatus: (state) => state.userSession?.isValid() ?? false,

    /**
     * Gets the current user's username, if any
     * @param {AuthState} state - the current state of the store
     * @returns {string|undefined} - username, if any
     */
    getUserName: (state) => state.cognitoUser?.getUsername(),
  },

  actions: {
    /**
     * Sets the current user session
     * @param {CognitoUserSession|undefined} payload - value to set
     * @returns {void}
     */
    setUserSession(payload: CognitoUserSession|undefined): void {
      this.userSession = payload

      if(this.userSession) {
        // Persist tokens to cookies
        const idToken = this.userSession.getIdToken().getJwtToken()
        const refreshToken = this.userSession.getRefreshToken().getToken()
        const accessToken = this.userSession.getAccessToken().getJwtToken()
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
    },

    /**
     * Sets the user pool
     * @param {CognitoUserPool|undefined} payload - value to set
     * @returns {void}
     */
    setUserPool(payload: CognitoUserPool|undefined): void {
      this.userPool = payload
    },

    /**
     * Sets the cognito user
     * @param {CognitoUser|undefined} payload - value to set
     * @returns {void}
     */
    setCognitoUser(payload: CognitoUser|undefined): void {
      this.cognitoUser = payload
    }
  }
});
