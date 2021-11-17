import {Module, createComposable} from 'vuex-smart-module'
import AuthState from './state';
import AuthActions from './actions';
import AuthGetters from './getters';
import AuthMutations from './mutations';

const authModule = new Module({
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions
})

export default authModule;

// Create composable function
export const useAuth = createComposable(authModule)
