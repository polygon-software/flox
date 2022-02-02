import SSRState from 'src/store/ssr/state';
import { Getters } from 'vuex-smart-module';

/**
 * Getters
 */
class SSRGetters extends Getters<SSRState> {
  /**
   * Gets prefetched data for a key
   * @returns {unknown|undefined} - any result
   */
  getPrefetchedData(): (key: string) => unknown | undefined {
    return (key) => this.state.prefetchedData[key];
  }

  /**
   * Returns true if prefetched data for the given key is in the store.
   * @returns {boolean} - presence of prefetched data
   */
  isPrefetched(): (key: string) => boolean {
    return (key) => this.state.prefetchedData[key] !== undefined;
  }
}

export default SSRGetters;
