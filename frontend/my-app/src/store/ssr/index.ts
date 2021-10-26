import {Module} from "vuex";
import state, {ssrStateInterface} from "src/store/ssr/state";
import {StateInterface} from "src/store";
import getters from "src/store/ssr/getters";
import mutations from "src/store/ssr/mutations";

const ssrModule: Module<ssrStateInterface, StateInterface> = {
  namespaced: true,
  getters,
  mutations,
  state
};

export default ssrModule;
