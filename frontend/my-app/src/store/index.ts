import { store } from 'quasar/wrappers'
import {createComposable, createStore} from 'vuex-smart-module'
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

export default store(function (/* { ssrContext } */) {
  const Store = createStore(
    // Root module
    authModule,

    // Vuex store options
  {
      strict: !!process.env.DEBUGGING
    }
  )

  return Store;
})

// Create composable function TODO needed?
// export const useStore = createComposable(store)

// export function useStore(): VuexStore<StateInterface> {
//   return vuexUseStore<StateInterface>(storeKey)
// }
