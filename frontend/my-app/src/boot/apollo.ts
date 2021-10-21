import { boot } from 'quasar/wrappers'
import ROUTES from '../router/routes'

export default boot(({ router, store }) => {
  // TODO apollo setup
  // router.beforeEach((to) => {
  //
  //   // Verify valid authentication
  //   if(to.path !== ROUTES.LOGIN.path && !store.getters['authentication/getLoggedInStatus']){
  //     return Promise.reject({ url: ROUTES.LOGIN.path })
  //   }
  // })
})
