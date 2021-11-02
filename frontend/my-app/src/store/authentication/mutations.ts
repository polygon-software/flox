import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import {deleteCookies, persistToCookies} from 'src/helpers/cookie-helpers'

function setUserSession (state: AuthStateInterface, payload: CognitoUserSession): void {
  state.userSession = payload

  if(state.userSession) {
    // Persist tokens to cookies
    const idToken = state.userSession.getIdToken().getJwtToken()
    const refreshToken = state.userSession.getRefreshToken().getToken()
    const accessToken = state.userSession.getAccessToken().getJwtToken()
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

function setUserPool (state: AuthStateInterface, payload: CognitoUserPool): void {
  state.userPool = payload
}

function setCognitoUser (state: AuthStateInterface, payload: CognitoUser): void {
  state.cognitoUser = payload
}

const mutations: MutationTree<AuthStateInterface> = {
  setUserSession,
  setUserPool,
  setCognitoUser,
};

export default mutations;
