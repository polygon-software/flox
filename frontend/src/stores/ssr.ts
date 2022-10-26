import { defineStore, PiniaCustomStateProperties } from 'pinia';

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
     * @returns any result
     */
    getPrefetchedData(
      state: {
        prefetchedData: Record<string, unknown>;
      } & PiniaCustomStateProperties<SsrState>
    ): (key: string) => any {
      return (key: string): any => state.prefetchedData[key];
    },
  },

  actions: {
    /**
     * Sets prefetched data state
     * @param payload - value to set
     */
    setPrefetchedData(payload: { key: string; value: unknown }): void {
      this.prefetchedData[payload.key] = payload.value;
    },
  },
});
