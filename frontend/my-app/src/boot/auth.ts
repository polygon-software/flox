import { boot } from 'quasar/wrappers'
import {

  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {root} from 'src/store';
import {Cookies} from 'quasar';

export default boot(({ store, ssrContext}) => {
  console.log('auth boot')
  // Set up authentication user pool
  const poolSettings:ICognitoUserPoolData = {
    UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
    ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? '',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)
  const $authStore = root.context(store).modules.authModule
  $authStore.mutations.setUserPool(userPool)
  let cognitoUser;
  if(process.env.SERVER && ssrContext){
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
    const XMLHttpRequest = require('xhr2');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const xht = new XMLHttpRequest() as XMLHttpRequest
    console.log(ssrContext)
    const cookies = Cookies.parseSSR(ssrContext)
    console.log(cookies)
    const accessToken = cookies.get('authentication.accessToken')
    console.log(accessToken)
    xht.open('POST','https://cognito-idp.eu-central-1.amazonaws.com/')
    xht.setRequestHeader('X-Amz-Target', 'AWSCognitoIdentityProviderService.GetUser');
    xht.setRequestHeader('Accept', 'application/json');
    xht.setRequestHeader('Content-Type', 'application/x-amz-json-1.1');
    xht.onreadystatechange = function (){
      console.log(xht.responseText)
    }
    xht.send(JSON.stringify({'AccessToken':accessToken}))
  } else {
    // cognitoUser = userPool.getCurrentUser()
  }
  // if(cognitoUser){
  //   // Auto-log in user
  //   cognitoUser.getSession(function(err: Error|null, session: CognitoUserSession|null) {
  //     if (!err) {
  //       const cognitoUserSession = session;
  //       // Set in store
  //       store.commit('authentication/setCognitoUser', cognitoUser)
  //       store.commit('authentication/setUserSession', cognitoUserSession)
  //       console.log("user set")
  //
  //     }
  //   });
  // }
})

