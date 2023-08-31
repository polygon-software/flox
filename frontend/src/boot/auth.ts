import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import jwtDecode from 'jwt-decode';
import { Cookies } from 'quasar';
import { boot } from 'quasar/wrappers';

import Env from 'src/env';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import { fetchMyUser } from 'src/flox/modules/auth/services/user.service';

import type { BootFileParams, QSsrContext } from '@quasar/app-vite';

/**
 * Performs authentication on server side
 *
 * @param ssrContext - Serverside rendering context
 * @param userPool - cognito user pool
 */
function serverSideAuth(
  ssrContext: QSsrContext,
  userPool: CognitoUserPool
): void {
  const $authStore = useAuthStore();
  const cookies = Cookies.parseSSR(ssrContext);

  // Tokens
  const accessToken = cookies.get('authentication.accessToken');
  const idToken = cookies.get('authentication.idToken');
  const refreshToken = cookies.get('authentication.refreshToken');

  if (!accessToken) {
    return;
  }

  const IdToken = new CognitoIdToken({
    IdToken: JSON.parse(idToken ?? '') as string,
  });
  const AccessToken = new CognitoAccessToken({
    AccessToken: JSON.parse(accessToken) as string,
  });
  const RefreshToken = new CognitoRefreshToken({
    RefreshToken: JSON.parse(refreshToken ?? '') as string,
  });

  const userSession = new CognitoUserSession({
    IdToken,
    AccessToken,
    RefreshToken,
  });

  const userData = jwtDecode<{ username: string }>(
    JSON.parse(accessToken) as string
  );

  const cognitoUser: CognitoUser = new CognitoUser({
    Pool: userPool,
    Username: userData.username,
  });

  if (!userSession.isValid()) {
    throw Error('User authentication failed');
  }

  $authStore.setCognitoUser(cognitoUser);
  $authStore.setUserSession(userSession);
}

/**
 * Performs authentication client side
 *
 * @param userPool - cognito user pool
 */
function clientSideAuth(userPool: CognitoUserPool): void {
  const $authStore = useAuthStore();
  const cognitoUser = userPool.getCurrentUser() || undefined;
  if (cognitoUser) {
    $authStore.setCognitoUser(cognitoUser);
    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (session) {
          $authStore.setUserSession(session);
        }
      }
    );
  }
}

interface FloxBootFileParams<T = any> extends BootFileParams<T> {
  ssrContext?: QSsrContext;
}

export default boot(async (bootContext: FloxBootFileParams) => {
  const $authStore = useAuthStore();

  // Set up authentication user pool
  const poolSettings = {
    UserPoolId: Env.VUE_APP_USER_POOL_ID,
    ClientId: Env.VUE_APP_USER_POOL_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(poolSettings);
  $authStore.setUserPool(userPool);

  if (Env.SERVER && bootContext.ssrContext) {
    serverSideAuth(bootContext.ssrContext, userPool);
  } else {
    clientSideAuth(userPool);
  }
  if ($authStore.loggedIn) {
    const user = await fetchMyUser();
    $authStore.setLoggedInUser(user);
  }
});
