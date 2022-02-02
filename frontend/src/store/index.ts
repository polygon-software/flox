import { store } from 'quasar/wrappers';
import { createStore, Module } from 'vuex-smart-module';
import authModule from './authentication';
import ssrModule from './ssr';
import feedModule from 'src/store/feed';

export const root = new Module({
  modules: {
    authModule,
    ssrModule,
    feedModule,
  },
});

export default store(function () {
  return createStore(
    // Root module
    root,

    // Vuex store options
    {
      strict: !!process.env.DEBUGGING,
    }
  );
});
