import { boot } from 'quasar/wrappers'
import ROUTES from '../router/routes'
import {Router} from 'vue-router';
import {root} from 'src/store';

let routerInstance: Router

export default boot(({ router, store}) => {
  // Get auth module within store (useAuth not working here)
  const $authStore = root.context(store).modules.authModule
  routerInstance = router
  router.beforeEach((to) => {
    const loggedIn = $authStore.getters.getLoggedInStatus()//   // Verify valid authentication
    if(to.path !== ROUTES.LOGIN.path && !loggedIn){
      return(ROUTES.LOGIN)
    } else if(to.path === ROUTES.LOGIN.path && loggedIn){
      // If user is logged in and trying to log in, redirect to main page
      return(ROUTES.MAIN)
    }
  })
})

// Router instance for use in Vue components
export {routerInstance}
