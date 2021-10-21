import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

function getLoggedInStatus (state: AuthStateInterface) {
  return state.userSession?.isValid() ?? false
}

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  getLoggedInStatus
};

export default getters;
