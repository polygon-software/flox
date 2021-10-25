import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';
import {Cookies} from 'quasar';

function setUserSession (state: AuthStateInterface, payload: CognitoUserSession) {
  state.userSession = payload
}

function setCognitoUser (state: AuthStateInterface, payload: CognitoUser) {
  state.cognitoUser = payload
}

// Based on cookie-persisted store state, re-set store to that state
function setPersistedState (state: AuthStateInterface, payload: AuthStateInterface){
  // Set cookie when SSR fetch is done (ie. only browser can set a cookie)
  if (!process.env.SERVER) {
    // TODO enable secure for production
    Cookies.set(
      'authentication',
      JSON.stringify(payload),
      {expires: 3, secure: false}
    )
  }

  // Copy payload to state
  state = {...payload} // TODO for each key?
}

const mutations: MutationTree<AuthStateInterface> = {
  setUserSession,
  setCognitoUser,
  setPersistedState
};

export default mutations;
