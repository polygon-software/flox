import { boot } from 'quasar/wrappers';
import { Router, RouteRecordRaw } from 'vue-router';

import { isModuleActive } from 'src/flox';
import { MODULES } from 'src/flox/MODULES';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import { fetchMyUser } from 'src/flox/modules/auth/services/user.service';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';

import ROUTES, { CONSTRAINED_ROUTES, PUBLIC_ROUTES } from '../router/routes';

// eslint-disable-next-line import/no-mutable-exports
let routerInstance: Router;

/**
 * Returns the component of the dashboard for the currently logged-in user
 *
 * @param user - the user, if any
 * @param $authStore - authentication stores
 * @returns the layout component
 */
function getUserRoleRoute(
  user: UserEntity | null,
  $authStore: ReturnType<typeof useAuthStore>
): RouteRecordRaw {
  // Non-logged in: Redirect to log in
  if (!user) {
    $authStore.setCognitoUser(undefined);
    $authStore.setUserSession(undefined);
    return ROUTES.LOGIN;
  }

  return ROUTES.HOME;
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

export default boot(({ router }) => {
  const $authStore = useAuthStore();
  routerInstance = router;
  // eslint-disable-next-line sonarjs/cognitive-complexity,consistent-return
  router.beforeEach(async (to) => {
    // Verify valid authentication
    const { loggedIn } = $authStore;

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
      if (isModuleActive(MODULES.ROLES)) {
        const matchingConstrainedRoute = CONSTRAINED_ROUTES.find(
          (constrainedRoute) => constrainedRoute.path === to.path
        );
        if (matchingConstrainedRoute) {
          const hasFullAccess =
            user.role &&
            matchingConstrainedRoute.allowedRoles.includes(user.role);
          if (!hasFullAccess) {
            return getUserRoleRoute(user, $authStore);
          }
        }
      }
    } else {
      // Default case: disallow access if not public
      // eslint-disable-next-line no-lonely-if
      if (!PUBLIC_ROUTES.some((publicRoute) => publicRoute.path === to.path)) {
        return ROUTES.LOGIN;
      }
    }
  });
});

// Router instance for use in Vue components
export { routerInstance };
