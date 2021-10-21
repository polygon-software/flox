<template>
  <router-view />
</template>

<script setup lang="ts">
import {AuthenticationService} from './services/AuthService';
import {provide, ref} from 'vue';
import {ErrorService} from './services/ErrorService';
// import {setupRouter} from "./router/route-helpers"; TODO

// const $q = useQuasar() TODO

// Error service
const $errorService = ref(new ErrorService($q))
provide('$errorService', $errorService)

// Auth service
const $authService = ref(new AuthenticationService($q, $errorService))
provide<AuthenticationService>('$authService', $authService)

// Quasar
provide('$q', $q)

// Set up router
// setupRouter($authService.value) TODO

</script>
