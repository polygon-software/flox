import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';
import {Cookies} from 'quasar';

function setUserSession (state: AuthStateInterface, payload: CognitoUserSession) {
  state.userSession = payload

  // TODO lul
  setPersistedState(state, state)
}

function setCognitoUser (state: AuthStateInterface, payload: CognitoUser) {
  state.cognitoUser = payload

  // TODO lul
  setPersistedState(state, state)
}

// Based on cookie-persisted store state, re-set store to that state
function setPersistedState (state: AuthStateInterface, payload: AuthStateInterface){
  console.log('Called setPersistedState with', state, 'and payload', payload)
  // Set cookie when SSR fetch is done (ie. only browser can set a cookie)
  if (!process.env.SERVER && payload) { // TODO do we even need &&payload ?
    console.log('Setting cookie to', JSON.stringify(payload))
    // TODO enable secure for production
    Cookies.set(
      'authentication',
      JSON.stringify(payload),
      {expires: 3, secure: false}
    )
  }

  console.log('state old:', state)
  // Copy payload to state
  state = {...payload} // TODO for each key?
  console.log('State new:', state)
}

const mutations: MutationTree<AuthStateInterface> = {
  setUserSession,
  setCognitoUser,
  setPersistedState
};

export default mutations;
