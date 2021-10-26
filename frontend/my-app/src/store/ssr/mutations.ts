import {MutationTree} from "vuex";
import {ssrStateInterface} from "src/store/ssr/state";

function setPrefetchedData(state: ssrStateInterface, payload: {key: string, value: Record<string, unknown>}){
  state.prefetchedData[payload.key] = payload.value;
  console.log(state.prefetchedData)
}

const mutations: MutationTree<ssrStateInterface> = {
  setPrefetchedData,
};

export default mutations;
