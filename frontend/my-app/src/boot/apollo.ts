import { boot } from 'quasar/wrappers'

export default boot(({ router, store }) => {
  console.log('TODO apollo', router, store)
  // TODO apollo setup
  // router.beforeEach((to) => {
  //
  //   // Verify valid authentication
  //   if(to.path !== ROUTES.LOGIN.path && !store.getters['authentication/getLoggedInStatus']){
  //     return Promise.reject({ url: ROUTES.LOGIN.path })
  //   }
  // })
})
