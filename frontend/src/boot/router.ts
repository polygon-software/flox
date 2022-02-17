import { boot } from 'quasar/wrappers'
import ROUTES, {PUBLIC_ROUTES} from '../router/routes'
import {Router} from 'vue-router';
import {root} from 'src/store';

let routerInstance: Router

export default boot(({ router, store}) => {
  // Get auth module within store (useAuth not working here)
  const $authStore = root.context(store).modules.authModule
  routerInstance = router
  router.beforeEach((to) => {
    const loggedIn = $authStore.getters.getLoggedInStatus()//   // Verify valid authentication

    // Not logged in, and going to non-public route
    if(!loggedIn && !PUBLIC_ROUTES.some((publicRoute) => publicRoute.path === to.path)){
      return(ROUTES.LOGIN)
    }

    // Logged in, and going to /login or base path
    if(loggedIn && (to.path === ROUTES.LOGIN.path || to.path === '/')){
      // If user is logged in and trying to log in, redirect to main page
      return(ROUTES.CUSTOMERS) // TODO make role-based
    }
  })
})

// Router instance for use in Vue components
export {routerInstance}
