<template>
  <router-view />
</template>

<script lang="ts">
// Cookies/Authentication
import {Cookies} from 'quasar';
import {CognitoUserSession} from 'amazon-cognito-identity-js';
import {inject} from 'vue';
import ROUTES from 'src/router/routes';
import {routerInstance} from 'boot/router';

export default{
// Prefetch hook
  preFetch({store, ssrContext}: {store: any, ssrContext: any}){

    console.log('Prefetch!')
    // const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    // TODO where needed...

    const userPool = store.getters['authentication/getUserPool']

    const cognitoUser = userPool.getCurrentUser();
    if(cognitoUser){
      console.log('WE have a user:', cognitoUser)
      cognitoUser.getSession(function(err: Error, data: CognitoUserSession) {
        if (err) {
          // Prompt the user to reauthenticate by hand...
          console.log("Can't auto-relogin user!")
        } else {
          const cognitoUserSession = data;
          console.log('Successful relogin with session', data)
          // Set in store
          store.commit('authentication/setUserSession', cognitoUserSession)
          // Redirect (we use the router instance directly, as it is not provided globally yet)
          void routerInstance.push(ROUTES.MAIN)
        }
      });
    }
  }
}

</script>

<script setup lang="ts">
import {AuthenticationService} from './services/AuthService';
import {provide, ref} from 'vue';
import {ErrorService} from './services/ErrorService';
import {useQuasar} from 'quasar';
import {RouterService} from 'src/services/RouterService';
import {routerInstance} from 'boot/router';
import {Cookies} from 'quasar'

const $q = useQuasar()

// Error service
const $errorService = ref(new ErrorService($q))
provide('$errorService', $errorService)

// Auth service
const $authService = ref(new AuthenticationService($q, $errorService))
provide<AuthenticationService>('$authService', $authService)

// Router service
const $routerService = ref(new RouterService(routerInstance))
provide<RouterService>('$routerService', $routerService)

// Quasar
provide('$q', $q)


</script>
