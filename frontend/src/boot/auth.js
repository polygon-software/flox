/* eslint-disable */
import { boot } from 'quasar/wrappers'
import {
  CognitoUser,
} from 'amazon-cognito-identity-js';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {root} from 'src/store';
import {Cookies} from 'quasar';
import * as _CognitoUserSession from 'amazon-cognito-identity-js/lib/CognitoUserSession';
import * as _CognitoIdToken from 'amazon-cognito-identity-js/lib/CognitoIdToken';
import * as _CognitoAccessToken from 'amazon-cognito-identity-js/lib/CognitoAccessToken';
import * as _CognitoRefreshToken from 'amazon-cognito-identity-js/lib/CognitoRefreshToken';
import axios from 'axios';

export default boot(async ({ store, ssrContext}) => {
  const $authStore = root.context(store).modules.authModule

  // Set up authentication user pool
  const poolSettings = {
    UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
    ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? '',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)
  $authStore.mutations.setUserPool(userPool)

  let cognitoUser;
  if(process.env.SERVER && ssrContext){
    const cookies = Cookies.parseSSR(ssrContext)

    //Tokens
    const accessToken = cookies.get('authentication.accessToken')
    const idToken = cookies.get('authentication.accessToken')
    const refreshToken = cookies.get('authentication.accessToken')

    if(!accessToken){return}
    await axios.post('https://cognito-idp.eu-central-1.amazonaws.com/', {
      'AccessToken':accessToken
    }, {headers: {
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
        'Accept': 'application/json',
        'Content-Type': 'application/x-amz-json-1.1'
      }
    }).then((response)=>{
      cognitoUser = new CognitoUser({
        Pool: userPool,
        Username: response.data.Username
      })
      $authStore.mutations.setCognitoUser(cognitoUser)

      const _idToken = new _CognitoIdToken['default']({
        IdToken: idToken
      });
      const _accessToken = new _CognitoAccessToken['default']({
        AccessToken: accessToken
      });
      const _refreshToken = new _CognitoRefreshToken['default']({
        RefreshToken: refreshToken
      });
      const sessionData = {
        IdToken: _idToken,
        AccessToken: _accessToken,
        RefreshToken: _refreshToken,
        ClockDrift: 0
      };
      const cachedSession = new _CognitoUserSession['default'](sessionData);
      $authStore.mutations.setUserSession(cachedSession)
    }).catch((err)=>{
      console.error("Authentication error:", err)
    })



  } else {
    cognitoUser = userPool.getCurrentUser() || undefined
    if(cognitoUser){
      $authStore.mutations.setCognitoUser(cognitoUser)
      cognitoUser.getSession(function(err, session) {
        if (!err) {
          $authStore.mutations.setUserSession(session)
        }
      })
    }

  }


})

