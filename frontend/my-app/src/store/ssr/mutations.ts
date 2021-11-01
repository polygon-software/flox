import {MutationTree} from 'vuex';
import {ssrStateInterface} from './state';

function setPrefetchedData(state: ssrStateInterface, payload: {key: string, value: Record<string, unknown>}){
  state.prefetchedData[payload.key] = payload.value;
}

const mutations: MutationTree<ssrStateInterface> = {
  setPrefetchedData,
};

export default mutations;
