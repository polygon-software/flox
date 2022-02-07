import { boot } from 'quasar/wrappers'
import ROUTES, {CONSTRAINED_ROUTES, PUBLIC_ROUTES} from '../router/routes'
import {Router} from 'vue-router';
import {root} from 'src/store';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {ROLE} from '../../definitions/ENUMS';

let routerInstance: Router

export default boot(({ router, store}) => {
  // Get auth module within store (useAuth not working here)
  const $authStore = root.context(store).modules.authModule
  routerInstance = router
  router.beforeEach(async (to) => {
    const loggedIn = $authStore.getters.getLoggedInStatus()//   // Verify valid authentication

    // Case 1: trying to access non-public route while not logged in
    if(!loggedIn && !PUBLIC_ROUTES.some((publicRoute) => {
      return publicRoute.path === to.path
    })){
      return(ROUTES.LOGIN)
    }
    // Case 2: going to login when logged in, or to default path '/'
    else if((to.path === ROUTES.LOGIN.path && loggedIn) || to.path === ROUTES.MAIN.path){
      const user = await getUser();
      return getUserRoleRoute(user)
    }
    // Case 3: route has some constraints
    const matchingConstrainedRoute = CONSTRAINED_ROUTES.find((constrainedRoute) => constrainedRoute.path === to.path)
    if(matchingConstrainedRoute){

      const user = await getUser();
      const hasFullAccess = matchingConstrainedRoute.allowedRoles.includes(user.role as ROLE)
      const hasConstrainedAccess = matchingConstrainedRoute.constrainedRoles.includes(user.role as ROLE)
      const hasNecessaryQueryParams = matchingConstrainedRoute.necessaryQueryParams.every((param) => to.query[param])

      if(!hasFullAccess && !(hasConstrainedAccess && hasNecessaryQueryParams)){
        return ROUTES.ERROR
      }
    }
    // Default case: allow access
  })
})

// Router instance for use in Vue components
export {routerInstance}

/**
 * Gets the currently logged in user's database entry
 * @returns {Promise<Record<string, unknown>>} - the user
 */
async function getUser() {
  // Get user's data from backend
  const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>
  return queryResult?.data?.getMyUser as Record<string, unknown> ?? null
}

/**
 * Returns the component of the dashboard for the currently logged in user
 * @param {Record<string, unknown>|null} user - the user, if any
 * @returns {any} - the layout component
 */
function getUserRoleRoute(user: Record<string, unknown>|null){
  // Non-logged in: Redirect to login
  if(!user){
    return ROUTES.LOGIN
  }

  switch(user.role){
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
