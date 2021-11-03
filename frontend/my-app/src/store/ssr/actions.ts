import { Actions } from 'vuex-smart-module'
import SSRState from 'src/store/ssr/state';
import SSRGetters from 'src/store/ssr/getters';
import SSRMutations from 'src/store/ssr/mutations';

/**
 * This file contains all authentication actions
 */

class SSRActions extends Actions<
    SSRState,
    SSRGetters,
    SSRMutations,
    SSRActions
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

export default SSRActions
