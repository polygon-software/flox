<template>
  <router-view />
</template>

<script lang="ts">
// Cookies/Authentication
import {Cookies} from 'quasar';
import {useStore} from 'src/store';

export default{
  // Prefetch hook
  preFetch({store, ssrContext}: {store: any, ssrContext: any}){
    console.log('Prefetch!')
    // const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    // TODO where needed...

    const userPool = store.getters['authentication/getUserPool']

    const cognitoUser = userPool.getCurrentUser();
    console.log('WE have a user:', cognitoUser)
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
