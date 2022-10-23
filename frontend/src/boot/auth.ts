import { boot } from 'quasar/wrappers';
import {
  CognitoUser,
  ICognitoUserData,
  CognitoUserSession,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Cookies } from 'quasar';
import axios, { AxiosResponse } from 'axios';
import { useAuthStore } from 'src/flox/modules/auth/stores/authentication.store';
import { QSsrContext } from '@quasar/app-vite';

/**
 * Makes request to cognito with access token, returns cognito user data
 * @param accessToken - cognito access token, stored in frontend cookie
 * @returns Cognito User Data
 */
function cognitoRequest(
  accessToken: string
): Promise<AxiosResponse<ICognitoUserData>> {
  const url = `https://cognito-idp.${
    process.env.VUE_APP_AWS_REGION ?? 'eu-central-1'
  }.amazonaws.com/`;
  const headers = {
    AccessToken: accessToken,
    'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
    Accept: 'application/json',
    'Content-Type': 'application/x-amz-json-1.1',
  };
  return axios.post<ICognitoUserData>(url, headers);
}

/**
 * Performs authentication on server side
 * @param ssrContext - Serverside rendering context
 * @param userPool - cognito user pool
 */
async function serverSideAuth(
  ssrContext: QSsrContext,
  userPool: CognitoUserPool
): Promise<void> {
  const $authStore = useAuthStore();
  const cookies = Cookies.parseSSR(ssrContext);

  //Tokens
  const accessToken = cookies.get('authentication.accessToken');
  const idToken = cookies.get('authentication.idToken');
  const refreshToken = cookies.get('authentication.refreshToken');

  if (!accessToken) {
    return;
  }
  const cognitoResponse = await cognitoRequest(accessToken);
  const cognitoUser = new CognitoUser({
    Pool: userPool,
    Username: cognitoResponse.data.Username,
  });
  $authStore.setCognitoUser(cognitoUser);

  const _idToken = new CognitoIdToken({
    IdToken: idToken ?? '',
  });
  const _accessToken = new CognitoAccessToken({
    AccessToken: accessToken,
  });
  const _refreshToken = new CognitoRefreshToken({
    RefreshToken: refreshToken ?? '',
  });
  const sessionData = {
    IdToken: _idToken,
    AccessToken: _accessToken,
    RefreshToken: _refreshToken,
    ClockDrift: 0,
  };
  const cachedSession = new CognitoUserSession(sessionData);
  $authStore.setUserSession(cachedSession);
}

/**
 * Performs authentication client side
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

export default boot(async (bootContext) => {
  const $authStore = useAuthStore();

  // Set up authentication user pool
  const poolSettings = {
    UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
    ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? '',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings);
  $authStore.setUserPool(userPool);

  // @ts-ignore
  if (process.env.SERVER && bootContext.ssrContext) {
    // @ts-ignore
    await serverSideAuth(bootContext.ssrContext, userPool);
  } else {
    clientSideAuth(userPool);
  }
});
