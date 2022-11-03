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
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import { fetchMyUser } from 'src/flox/modules/auth/services/user.service';

export interface AuthState {
  userSession?: CognitoUserSession;
  userPool?: CognitoUserPool;
  cognitoUser?: CognitoUser;
  loggedInUser?: UserEntity;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    userSession: undefined,
    userPool: undefined,
    cognitoUser: undefined,
    loggedInUser: undefined,
  }),

  getters: {
    /**
     * Gets logged in status
     * @param state - the current state of the store
     * @returns whether the user is logged in
     */
    getLoggedInStatus: (state): boolean => state.userSession?.isValid() ?? false,

    /**
     * Gets the current user's username, if any
     * @param state - the current state of the store
     * @returns username, if any
     */
    getUserName: (state) => state.loggedInUser?.username,
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
    setLoggedInUser(payload: UserEntity | undefined): void {
      this.loggedInUser = payload;
    }
  },
});
