import { store } from 'quasar/wrappers'
import {createStore, Module} from 'vuex-smart-module'
import authModule from './authentication'

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// TODO...
// export interface StateInterface {
//   authentication: AuthStateInterface
// }

// provide typings for `this.$store`
// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $store: VuexStore<StateInterface>
//   }
// }

// provide typings for `useStore` helper
// export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key')
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
