import { boot } from 'quasar/wrappers';
import ROUTES, { CONSTRAINED_ROUTES, PUBLIC_ROUTES } from '../router/routes';
import { Router } from 'vue-router';
import { User } from 'src/data/types/User';
import { fetchMyUser } from 'src/helpers/data/fetch-helpers';
import {isModuleActive} from 'src/flox';
import {MODULES} from 'src/flox/MODULES';
import {useAuthStore} from 'stores/authentication';

let routerInstance: Router;

export default boot(({ router, store }) => {
  // Get auth store within stores (useAuth not working here)
  const $authStore = useAuthStore()
  routerInstance = router;
  // eslint-disable-next-line sonarjs/cognitive-complexity
  router.beforeEach(async (to) => {
    // Verify valid authentication
    const loggedIn = $authStore.getLoggedInStatus;

    // TODO: Add as part of sharing module
    // Case 1: trying to access non-public route while not logged in
    // if (
    //   !loggedIn &&
    //   !PUBLIC_ROUTES.some((publicRoute) => {
    //     return publicRoute.path === to.path;
    //   })
    // ) {
    //   // Check if it is a public link
    //   if (to.query.key) {
    //     const validKey = await fetchKeyValid(to.path, to.query.key as string);
    //     if (validKey) {
    //       return true;
    //     }
    //   }
    //   return ROUTES.LOGIN;
    // } else
    if (loggedIn) {
      const user = await fetchMyUser();

      // Case 2: going to log in when logged in, or to default path '/'
      if (!user || to.path === ROUTES.LOGIN.path || to.path === '/') {
        return getUserRoleRoute(user, $authStore);
      }

      // Case 3: role module is active and route has some constraints
      if(isModuleActive(MODULES.ROLES)){
        const matchingConstrainedRoute = CONSTRAINED_ROUTES.find(
          (constrainedRoute) => constrainedRoute.path === to.path
        );
        if (matchingConstrainedRoute) {
          const hasFullAccess = matchingConstrainedRoute.allowedRoles.includes(
            user.role
          );
          if (!hasFullAccess) {
            return getUserRoleRoute(user, $authStore);
          }
        }
      }
    } else {
      // Default case: disallow access if not public
      if(!PUBLIC_ROUTES.some((publicRoute) => publicRoute.path === to.path)){
        return ROUTES.LOGIN
      }
    }
  });
});

// Router instance for use in Vue components
export { routerInstance };

/**
 * Returns the component of the dashboard for the currently logged-in user
 * @param {User|null} user - the user, if any
 * @param {useAuthStore} $authStore - authentication store
 * @returns {any} - the layout component
 */
function getUserRoleRoute(
  user: User | null,
  $authStore: ReturnType<typeof useAuthStore>
) {
  // Non-logged in: Redirect to log in
  if (!user) {
    $authStore.setCognitoUser(undefined);
    $authStore.setUserSession(undefined);
    return ROUTES.LOGIN;
  }

  return ROUTES.SAMPLE
  // TODO application specific: add paths per role
  // switch (user.role) {
  //   case ROLE.ADMIN:
  //     return ROUTES.CUSTOMERS;
  //   case ROLE.USER:
  //     return ROUTES.CUSTOMERS.path + '/' + user.username;
  //   default:
  //     return ROUTES.LOGIN;
  // }
}
