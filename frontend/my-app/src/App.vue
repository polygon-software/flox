<template>
  <router-view />
</template>

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

// Cookies/Authentication
preFetch({store, ssrContext}) {
    const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    store.commit('authentication/setPersistedState', cookies.get('authentication')) // TODO
  }

</script>
