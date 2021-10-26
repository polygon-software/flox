import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';
import {CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
// import {Cookies} from 'quasar'; TODO needed?

function setUserSession (state: AuthStateInterface, payload: CognitoUserSession) {
  state.userSession = payload
}

function setUserPool (state: AuthStateInterface, payload: CognitoUserPool) {
  state.userPool = payload
}

function setCognitoUser (state: AuthStateInterface, payload: CognitoUser) {
  state.cognitoUser = payload
}
//
// // Based on cookie-persisted store state, re-set store to that state
// function setPersistedData (state: AuthStateInterface, payload: any){
//   console.log('Called setPersistedState with', state, 'and payload', payload)
//   // Set cookie when SSR fetch is done (ie. only browser can set a cookie)
//   if (!process.env.SERVER && payload) { // TODO do we even need &&payload ?
//     // TODO enable secure for production
//     Object.keys(payload).forEach((key: string) => {
//
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       const data: any = payload[key]
//       console.log('Data:', data)
//       Cookies.set(
//         `authentication.${key}`,
//         JSON.stringify(data),
//         {expires: 3, secure: false}
//       )
//     })
//   }
//   //
//   // console.log('state old:', state)
//   // // Copy payload to state
//   // state = {...payload} // TODO for each key
//   // console.log('State new:', state) TODO get...
// }

const mutations: MutationTree<AuthStateInterface> = {
  setUserSession,
  setUserPool,
  setCognitoUser,
};

export default mutations;
