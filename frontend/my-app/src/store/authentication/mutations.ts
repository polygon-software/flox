import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';

function setUserSession (state: AuthStateInterface, payload: CognitoUserSession) {
  state.userSession = payload
}

function setCognitoUser (state: AuthStateInterface, payload: CognitoUser) {
  state.cognitoUser = payload
}

const mutations: MutationTree<AuthStateInterface> = {
  setUserSession,
  setCognitoUser,
};

export default mutations;
