import { defineStore } from 'pinia';

interface SsrState {
  prefetchedData: Record<string, unknown>;
}

export const useSsrStore = defineStore('ssrState', {
  state: (): SsrState => ({
    prefetchedData: {},
  }),

  getters: {
    /**
     * Gets prefetched data for a key
     * @param state - the current state of the store
     * @param key - Key for which to retrieve data
     * @returns any result
     */
    getPrefetchedData(state) {
      return (key: string) => state.prefetchedData[key];
    },
  },

  actions: {
    /**
     * Sets prefetched data state
     * @param {{key: string, value: unknown}} payload - value to set
     * @returns {void}
     */
    setPrefetchedData(payload: { key: string; value: unknown }): void {
      this.prefetchedData[payload.key] = payload.value;
    },
  },
});
