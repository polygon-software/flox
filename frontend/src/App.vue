<template>
  <router-view />
</template>

<script setup lang="ts">
import {AuthenticationService} from './services/AuthService';
import {provide, reactive} from 'vue';
import {ErrorService} from './services/ErrorService';
import {useQuasar} from 'quasar';
import {RouterService} from 'src/services/RouterService';
import {routerInstance} from 'boot/router';

const $q = useQuasar()

// Error service
const $errorService: ErrorService = reactive(new ErrorService($q))
provide<ErrorService>('$errorService', $errorService)

// Router service
const $routerService: RouterService = reactive(new RouterService(routerInstance))
provide<RouterService>('$routerService', $routerService)

// Auth service
const $authService: AuthenticationService = reactive(new AuthenticationService($q, $errorService, $routerService))
provide<AuthenticationService>('$authService', $authService)

// Quasar
provide('$q', $q)


</script>
