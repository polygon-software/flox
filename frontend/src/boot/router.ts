import { boot } from 'quasar/wrappers';
import ROUTES, { CONSTRAINED_ROUTES, PUBLIC_ROUTES } from '../router/routes';
import { Router } from 'vue-router';
import { root } from 'src/store';
import { User } from 'src/data/types/User';
import { Context, Module } from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthActions from 'src/store/authentication/actions';
import AuthMutations from 'src/store/authentication/mutations';
import { fetchMyUser } from 'src/helpers/api-helpers';

let routerInstance: Router;

export default boot(({ router, store }) => {
  // Get auth module within store (useAuth not working here)
  const $authStore = root.context(store).modules.authModule;
  routerInstance = router;
  // eslint-disable-next-line sonarjs/cognitive-complexity
  router.beforeEach(async (to) => {
    const loggedIn = $authStore.getters.getLoggedInStatus(); //   // Verify valid authentication

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

      // Case 2: going to login when logged in, or to default path '/'
      if (!user || to.path === ROUTES.LOGIN.path || to.path === '/') {
        return getUserRoleRoute(user, $authStore);
      }

      // Case 3: route has some constraints
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
    } else {
      // TODO
    }

    // Default case: allow access if public
    return PUBLIC_ROUTES.some((publicRoute) => publicRoute.path === to.path)
  });
});

// Router instance for use in Vue components
export { routerInstance };

/**
 * Returns the component of the dashboard for the currently logged in user
 * @param {User|null} user - the user, if any
 * @param {Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions, Record<string, any>>>} $authStore - authentication store
 * @returns {any} - the layout component
 */
function getUserRoleRoute(
  user: User | null,
  $authStore: Context<
    Module<
      AuthState,
      AuthGetters,
      AuthMutations,
      AuthActions,
      Record<string, any>
      >
    >
) {
  // Non-logged in: Redirect to login
  if (!user) {
    $authStore.mutations.setCognitoUser(undefined);
    $authStore.mutations.setUserSession(undefined);
    return ROUTES.LOGIN;
  }

  return ROUTES.SAMPLE
  // TODO: Add in user role module
  // switch (user.role) {
  //   case ROLE.ADMIN:
  //     return ROUTES.CUSTOMERS;
  //   case ROLE.USER:
  //     return ROUTES.CUSTOMERS.path + '/' + user.username;
  //   default:
  //     return ROUTES.LOGIN;
  // }
}
