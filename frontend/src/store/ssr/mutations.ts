import { Mutations } from 'vuex-smart-module'
import SSRState from 'src/store/ssr/state';

/**
 * Mutations
 */
class SSRMutations extends Mutations<SSRState>{
  /**
   * Sets prefetched data state
   * @param {{key: string, value: unknown}} payload - value to set
   * @returns {void}
   */
  setPrefetchedData(payload: {key: string, value: unknown}): void{
    this.state.prefetchedData[payload.key] = payload.value;
  }
}
export default SSRMutations;
