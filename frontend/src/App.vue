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
import {isModuleActive} from 'src/flox/flox';
import {MODULES} from 'src/flox/MODULES';

// Quasar
const $q = useQuasar()
provide('$q', $q)

// Error service
const $errorService: ErrorService = reactive(new ErrorService($q))
provide('$errorService', $errorService)

// Router service
const $routerService = reactive(new RouterService(routerInstance))
provide<RouterService>('$routerService', $routerService as unknown as RouterService)


/**
 * Enabled Flox modules (depending on flox.config.js)
 */

// Auth service
if(isModuleActive(MODULES.AUTH)){
  const $authService = reactive(new AuthenticationService($q, $errorService))
  provide<AuthenticationService>('$authService', $authService as AuthenticationService)
}

</script>
