import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

function getLoggedInStatus (state: AuthStateInterface) {
  return state.userSession?.isValid() ?? false
}

function getCognitoUser (state: AuthStateInterface) {
  return state.cognitoUser
}

function getUserSession (state: AuthStateInterface) {
  return state.userSession
}

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  getLoggedInStatus,
  getCognitoUser,
  getUserSession
};

export default getters;
