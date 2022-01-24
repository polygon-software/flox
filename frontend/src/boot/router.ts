import { boot } from 'quasar/wrappers'
import ROUTES, {PUBLIC_ROUTES} from '../router/routes'
import {Router} from 'vue-router';
import {root} from 'src/store';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {ROLE} from '../../../shared/definitions/ENUMS';

let routerInstance: Router

export default boot(({ router, store}) => {
  // Get auth module within store (useAuth not working here)
  const $authStore = root.context(store).modules.authModule
  routerInstance = router
  router.beforeEach((to) => {
    const loggedIn = $authStore.getters.getLoggedInStatus()//   // Verify valid authentication
    if(!loggedIn && !PUBLIC_ROUTES.some((publicRoute) => {
      return publicRoute.path === to.path
    })){
      return(ROUTES.LOGIN)
    }else if((to.path === ROUTES.LOGIN.path && loggedIn) || to.path === ROUTES.MAIN.path){
      return getUserRoleRoute()
    }
  })
})

// Router instance for use in Vue components
export {routerInstance}




/**
 * Returns the component of the dashboard for the currently logged in user
 * @async
 * @returns {any} - the layout component
 */
async function getUserRoleRoute(): Promise<any>{
  // Get user's data from backend
  const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>

  // Non-logged in: Redirect to login
  if(!queryResult?.data?.getMyUser){
    return ROUTES.LOGIN
  }

  const userData = queryResult.data.getMyUser as Record<string, unknown>
  const userRole = userData.role;

  switch(userRole){
    case ROLE.SOI_ADMIN:
      return ROUTES.ADMIN_DOSSIERS
    case ROLE.SOI_EMPLOYEE:
      return ROUTES.APPLICATIONS
    case ROLE.COMPANY:
      return ROUTES.MANAGEMENT_EMPLOYEE_DATA
    case ROLE.EMPLOYEE:
      return ROUTES.EMPLOYEE_DASHBOARD
    case ROLE.BANK:
      return ROUTES.BANK_DASHBOARD
    default:
      return ROUTES.LOGIN
  }
}
