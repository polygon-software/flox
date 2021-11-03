import { boot } from 'quasar/wrappers'
import {
  CognitoUser,
  CognitoUserSession,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import {CognitoAuth, CognitoAuthSession} from "amazon-cognito-auth-js";


export default boot(({ store}) => {
  console.log("auth boot")
  // Set up authentication user pool
  const poolSettings:ICognitoUserPoolData = {
    UserPoolId: process.env.VUE_APP_USER_POOL_ID ?? '',
    ClientId: process.env.VUE_APP_USER_POOL_CLIENT_ID ?? '',
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolSettings)
  store.commit('authentication/setUserPool', userPool)
  const cognitoUser = CognitoIdentityServiceProvider
  if(cognitoUser){
    // Auto-log in user
    cognitoUser.getSession(function(err: Error|null, session: CognitoUserSession|null) {
      if (!err) {
        const cognitoUserSession = session;
        // Set in store
        store.commit('authentication/setCognitoUser', cognitoUser)
        store.commit('authentication/setUserSession', cognitoUserSession)
        console.log("user set")

      }
    });
  }
})

