import { boot } from 'quasar/wrappers'
import ROUTES from '../router/routes'

export default boot(({ router, store }) => {
  router.beforeEach((to) => {
    // TODO store
    if(to.path !== ROUTES.LOGIN.path && !store.getLoggedInStatus.value){
      return Promise.reject({ url: ROUTES.LOGIN.path })
    }
  })
})
