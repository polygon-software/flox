import { boot } from 'quasar/wrappers'
import ROUTES from '../router/routes'

export default boot(({ router, store }) => {
  router.beforeEach((to) => {
    console.log('blubb!')
    // Verify valid authentication
    if(to.path !== ROUTES.LOGIN.path && !store.getters['authentication/getLoggedInStatus']){
      //next({ name: 'account-signin', query: { next: to.fullPath } })

      return Promise.reject({ url: ROUTES.LOGIN.path })
    }
  })
})
