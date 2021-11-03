import { Mutations } from 'vuex-smart-module'
import SSRState from 'src/store/ssr/state';

class SSRMutations extends Mutations<SSRState>{

  setPrefetchedData(payload: {key: string, value: Record<string, unknown>}){
    this.state.prefetchedData[payload.key] = payload.value;
  }
}
export default SSRMutations;
