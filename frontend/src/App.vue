<template>
  <router-view />
</template>

<script setup lang="ts">
import {AuthenticationService} from './services/AuthService';
import {provide, reactive} from 'vue';
import {ErrorService} from './services/ErrorService';
import {useQuasar} from 'quasar';
import {RouterService} from 'src/services/RouterService';
import { DialogService } from 'src/services/DialogService';

const $q = useQuasar()

// Error service
const $errorService: ErrorService = reactive(new ErrorService($q))
provide('$errorService', $errorService)

// Auth service
const $authService: AuthenticationService = reactive(new AuthenticationService($q, $errorService))
provide('$authService', $authService)

// Router service
const $routerService: RouterService = reactive(new RouterService())
provide('$routerService', $routerService)

// Dialog service
const $dialogService: DialogService = reactive(new DialogService($q))
provide('$dialogService', $dialogService)

// Quasar
provide('$q', $q)


</script>
