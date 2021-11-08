import AuthState  from './state';
import { Actions } from 'vuex-smart-module'
import AuthGetters from './getters';
import AuthMutations from './mutations';

/**
 * This file contains all authentication actions
 */

class AuthActions extends Actions<
    AuthState,
    AuthGetters,
    AuthMutations,
    AuthActions
  >
{
  // Actions go here, example...
  // incrementAsync(payload: { amount: number; interval: number }) {
  //   // Actions instance has 'state', 'getters', 'commit' and 'dispatch' properties
  //
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       this.commit('increment', payload.amount)
  //       resolve()
  //     }, payload.interval)
  //   })
  // }
}

export default AuthActions
