import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { defineStore } from 'pinia';

import {
  deleteCookies,
  persistToCookies,
} from 'src/flox/modules/auth/tools/cookie.helpers';

export interface AuthState {
  userSession: CognitoUserSession | undefined;
  userPool: CognitoUserPool | undefined;
  cognitoUser: CognitoUser | undefined;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    userSession: undefined,
    userPool: undefined,
    cognitoUser: undefined,
  }),

  getters: {
    /**
     * Gets logged in status
     * @param state - the current state of the store
     * @returns whether the user is logged in
     */
    getLoggedInStatus: (state) => state.userSession?.isValid() ?? false,

    /**
     * Gets the current user's username, if any
     * @param state - the current state of the store
     * @returns username, if any
     */
    getUserName: (state) => state.cognitoUser?.getUsername(),
  },

  actions: {
    /**
     * Sets the current user session
     * @param payload - value to set
     */
    setUserSession(payload: CognitoUserSession | undefined): void {
      this.userSession = payload;

      if (this.userSession) {
        // Persist tokens to cookies
        const idToken = this.userSession.getIdToken().getJwtToken();
        const refreshToken = this.userSession.getRefreshToken().getToken();
        const accessToken = this.userSession.getAccessToken().getJwtToken();
        persistToCookies('authentication', {
          idToken,
          refreshToken,
          accessToken,
        });
      } else {
        deleteCookies('authentication');
      }
    },

    /**
     * Sets the user pool
     * @param payload - value to set
     */
    setUserPool(payload: CognitoUserPool | undefined): void {
      this.userPool = payload;
    },

    /**
     * Sets the cognito user
     * @param payload - value to set
     */
    setCognitoUser(payload: CognitoUser | undefined): void {
      this.cognitoUser = payload;
    },
  },
});
