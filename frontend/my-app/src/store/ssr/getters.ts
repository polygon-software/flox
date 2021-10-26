import {GetterTree} from "vuex";
import {StateInterface} from "src/store";
import {ssrStateInterface} from "src/store/ssr/state";

function getPrefetchedData(state:ssrStateInterface): (key: string) => unknown | undefined {
  return (key) => state.prefetchedData[key]
}


const getters: GetterTree<ssrStateInterface, StateInterface> = {
  getPrefetchedData,
};

export default getters;
