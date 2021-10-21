import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import {CognitoUser, CognitoUserSession} from 'amazon-cognito-identity-js';

function getLoggedInStatus (state: AuthStateInterface): boolean {
  return state.userSession?.isValid() ?? false
}

function getCognitoUser (state: AuthStateInterface): CognitoUser|undefined {
  return state.cognitoUser
}

function getUsername (state: AuthStateInterface): string|undefined {
  return state.cognitoUser?.getUsername()
}

function getUserSession (state: AuthStateInterface): CognitoUserSession|undefined {
  return state.userSession
}

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  getLoggedInStatus,
  getCognitoUser,
  getUserSession,
  getUsername,
};

export default getters;
