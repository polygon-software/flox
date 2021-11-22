import {Module, createComposable} from 'vuex-smart-module'
import SSRState from 'src/store/ssr/state';
import SSRGetters from 'src/store/ssr/getters';
import SSRMutations from 'src/store/ssr/mutations';
import SSRActions from 'src/store/ssr/actions';

const ssrModule = new Module({
  state: SSRState,
  getters: SSRGetters,
  mutations: SSRMutations,
  actions: SSRActions
})

export default ssrModule;

// Create composable function
export const useSSR = createComposable(ssrModule)
