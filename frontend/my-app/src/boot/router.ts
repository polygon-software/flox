import { boot } from 'quasar/wrappers'
import ROUTES from '../router/routes'
import {Router} from 'vue-router';

let routerInstance: Router

export default boot(({ router,store}) => {
  routerInstance = router
  router.beforeEach((to) => {
    console.log("router check")
    // Verify valid authentication
    if(to.path !== ROUTES.LOGIN.path && !store.getters['authentication/getLoggedInStatus']){
      return(ROUTES.LOGIN)
    } else if(to.path === ROUTES.LOGIN.path && store.getters['authentication/getLoggedInStatus']){
      // If user is logged in and trying to log in, redirect to main page
      return(ROUTES.MAIN)
    }
  })
})

// Router instance for use in Vue components
export {routerInstance}
