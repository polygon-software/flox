import { boot } from 'quasar/wrappers'
import {
  CognitoUser,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {root} from 'src/store';
import {Cookies} from 'quasar';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment
function _interopRequireDefault(obj:unknown) { // @ts-ignore
  return obj && obj.__esModule ? obj : { 'default': obj }; }
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _CognitoUserSession = _interopRequireDefault(require('amazon-cognito-identity-js/lib/CognitoUserSession'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _CognitoIdToken = _interopRequireDefault(require('amazon-cognito-identity-js/lib/CognitoIdToken'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _CognitoAccessToken = _interopRequireDefault(require('amazon-cognito-identity-js/lib/CognitoAccessToken'));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _CognitoRefreshToken = _interopRequireDefault(require('amazon-cognito-identity-js/lib/CognitoRefreshToken'));

export default boot(async ({ store, ssrContext}) => {
  console.log('auth boot')

  const $authStore = root.context(store).modules.authModule

  // Set up authentication user pool
  const poolSettings:ICognitoUserPoolData = {
    UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
    ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? '',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)
  $authStore.mutations.setUserPool(userPool)

  let cognitoUser: CognitoUser|undefined;
  if(process.env.SERVER && ssrContext){
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
    const XMLHttpRequest = require('xhr2');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const xht = new XMLHttpRequest() as XMLHttpRequest
    const cookies = Cookies.parseSSR(ssrContext)
    const accessToken = cookies.get('authentication.accessToken')
    if(!accessToken){return}
    xht.open('POST','https://cognito-idp.eu-central-1.amazonaws.com/')
    xht.setRequestHeader('X-Amz-Target', 'AWSCognitoIdentityProviderService.GetUser');
    xht.setRequestHeader('Accept', 'application/json');
    xht.setRequestHeader('Content-Type', 'application/x-amz-json-1.1');
    await new Promise<void>(((resolve) => {
      xht.onreadystatechange = function (){
        const responseObject: Record<string, unknown> = JSON.parse(xht.response) as Record<string, unknown>

        if(!xht.response || xht.status !== 200){
          console.log('rejecting with xht.status: ' + xht.status.toString())
          // reject()
          return
        }
        cognitoUser = new CognitoUser({
          Pool: userPool,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          Username: responseObject.Username as string,
        })
        $authStore.mutations.setCognitoUser(cognitoUser)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const idToken = new _CognitoIdToken['default']({
          IdToken: cookies.get('authentication.idToken')
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const accessToken = new _CognitoAccessToken['default']({
          AccessToken: cookies.get('authentication.accessToken')
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const refreshToken = new _CognitoRefreshToken['default']({
          RefreshToken: cookies.get('authentication.refreshToken')
        });
        const sessionData = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          IdToken: idToken,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          AccessToken: accessToken,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          RefreshToken: refreshToken,
          ClockDrift: 0
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
        const cachedSession = new _CognitoUserSession['default'](sessionData);
        $authStore.mutations.setUserSession(cachedSession)
        resolve()
      }
      xht.send(JSON.stringify({'AccessToken':accessToken}))
    }))

  } else {
    cognitoUser = userPool.getCurrentUser() || undefined
    if(cognitoUser){
      $authStore.mutations.setCognitoUser(cognitoUser)
      cognitoUser.getSession(function(err: Error|null, session: AmazonCognitoIdentity.CognitoUserSession|undefined) {
        if (!err) {
          $authStore.mutations.setUserSession(session)
        }
      })
    }

  }


})

