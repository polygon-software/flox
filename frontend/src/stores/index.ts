import { createPinia } from 'pinia';
import { store } from 'quasar/wrappers';
import { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  return createPinia();
});
