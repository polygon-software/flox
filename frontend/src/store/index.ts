import { store } from 'quasar/wrappers'
import {createStore, Module} from 'vuex-smart-module'
import authModule from './authentication'

export const root = new Module({
    modules: {
      authModule,
    }
  })

export default store(function (/* { ssrContext } */) {
  const Store = createStore(
    // Root module
    root,

    // Vuex store options
  {
      strict: !!process.env.DEBUGGING
    }
  )

  return Store;
})
