import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { stores, ssrContext } */) {
  const historyType =
    process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;
  const createHistory = process.env.SERVER ? createMemoryHistory : historyType;

  const routeArray: RouteRecordRaw[] = Object.values(routes);

  return createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: routeArray,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
});
