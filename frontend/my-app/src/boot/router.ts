import { boot } from 'quasar/wrappers'
import ROUTES from '../router/routes'
import {Router} from 'vue-router';

let routerInstance: Router

export default boot(({ router, store }) => {
  routerInstance = router
  router.beforeEach((to) => {
    // Verify valid authentication
    if(to.path !== ROUTES.LOGIN.path && !store.getters['authentication/getLoggedInStatus']){
      return(ROUTES.LOGIN)
      // return Promise.reject({ url: ROUTES.LOGIN.path })
    }
  })
})

// Router instance for use in Vue components
export {routerInstance}
