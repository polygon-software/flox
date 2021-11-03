import {Getters, Mutations, Actions, Module, createComposable} from 'vuex-smart-module'
import AuthState , { AuthStateInterface } from './state';
import AuthActions from './actions';
import AuthGetters from './getters';
import AuthMutations from './mutations';

// const authModule: Module<AuthStateInterface, StateInterface> = {
//   namespaced: true,
//   actions,
//   getters,
//   mutations,
//   state
// };
// Create a module with module asset classes
const authModule = new Module({
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions
})
export default authModule;

// Create composable function
export const useAuth = createComposable(authModule)
