<template>
  <router-view />
</template>

<script lang="ts">
import {routerInstance} from 'boot/router';


</script>

<script setup lang="ts">
import {AuthenticationService} from './services/AuthService';
import {provide, Ref, ref} from 'vue';
import {ErrorService} from './services/ErrorService';
import {useQuasar} from 'quasar';
import {RouterService} from 'src/services/RouterService';
import {routerInstance} from 'boot/router';

const $q = useQuasar()

// Error service
const $errorService: Ref<ErrorService> = ref(new ErrorService($q))
provide('$errorService', $errorService)

// Auth service
const $authService: Ref<AuthenticationService> = ref(new AuthenticationService($q, $errorService))
provide<Ref<AuthenticationService>>('$authService', $authService)

// Router service
const $routerService: Ref<RouterService> = ref(new RouterService(routerInstance))
provide<Ref<RouterService>>('$routerService', $routerService)

// Quasar
provide('$q', $q)


</script>
