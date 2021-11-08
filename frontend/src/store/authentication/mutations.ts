import AuthState  from './state';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import {deleteCookies, persistToCookies} from 'src/helpers/cookie-helpers'
import { Mutations } from 'vuex-smart-module'


class AuthMutations extends Mutations<AuthState>{
  setUserSession (payload: CognitoUserSession|undefined): void {
    this.state.userSession = payload

    if(this.state.userSession) {
      // Persist tokens to cookies
      const idToken = this.state.userSession.getIdToken().getJwtToken()
      const refreshToken = this.state.userSession.getRefreshToken().getToken()
      const accessToken = this.state.userSession.getAccessToken().getJwtToken()
      persistToCookies(
        'authentication',
        {
          idToken,
          refreshToken,
          accessToken
        }
      )
    } else {
      deleteCookies('authentication')
    }
  }

  setUserPool (payload: CognitoUserPool|undefined): void {
    this.state.userPool = payload
  }

  setCognitoUser (payload: CognitoUser|undefined): void {
    this.state.cognitoUser = payload
  }
}

export default AuthMutations;
