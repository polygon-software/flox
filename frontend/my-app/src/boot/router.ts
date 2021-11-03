import { boot } from 'quasar/wrappers'
// import ROUTES from '../router/routes'
import {Router} from 'vue-router';
// import {useAuth} from 'src/store/authentication';

let routerInstance: Router

export default boot(({ router }) => {
  // const $authStore = useAuth()
  // TODO
  // routerInstance = router
  // router.beforeEach((to) => {
  //   // Verify valid authentication
  //   if(to.path !== ROUTES.LOGIN.path && !$authStore.getters.getLoggedInStatus()){
  //     return(ROUTES.LOGIN)
  //   } else if(to.path === ROUTES.LOGIN.path && !$authStore.getters.getLoggedInStatus()){
  //     // If user is logged in and trying to log in, redirect to main page
  //     return(ROUTES.MAIN)
  //   }
  // })
})

// Router instance for use in Vue components
export {routerInstance}
