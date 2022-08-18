<template>
  <router-view />
</template>

<script setup lang="ts">
import {AuthenticationService} from './flox/modules/auth/services/AuthService';
import {provide, reactive} from 'vue';
import {ErrorService} from './services/ErrorService';
import {useQuasar} from 'quasar';
import {RouterService} from 'src/services/RouterService';
import {routerInstance} from 'boot/router';
import {isModuleActive} from 'src/flox';
import {MODULES} from 'src/flox/MODULES';
import LogRocket from 'logrocket';

// Add LogRocket to production deployments / builds
if(process.env.VUE_APP_PRODUCTION === 'true'){
  LogRocket.init('md69mq/flox'); // TODO application specific: Change LogRocket ID
}

// Quasar
const $q = useQuasar()
provide('$q', $q)

// Error service
const $errorService: ErrorService = reactive(new ErrorService($q))
provide('$errorService', $errorService)

// Router service ('as unknown' is needed, since linter doesn't seem to understand router instance as parameter)
const $routerService: RouterService = reactive(new RouterService(routerInstance)) as unknown as RouterService
provide<RouterService>('$routerService', $routerService as unknown as RouterService)


/**
 * Enabled Flox modules (depending on flox.config.json)
 */

// Auth service
if(isModuleActive(MODULES.AUTH)){
  const $authService: AuthenticationService = reactive(new AuthenticationService($q, $errorService, $routerService)) as unknown as AuthenticationService
  provide<AuthenticationService>('$authService', $authService)
}
</script>
