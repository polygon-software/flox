<template>
  <router-view/>
</template>

<script setup lang="ts">
import {useQuasar} from "quasar";
import {AuthenticationService} from "@/services/AuthService";
import {provide, ref} from "vue";
import {ErrorService} from "@/services/ErrorService";
import {setupRouter} from "@/router/route-helpers";

const $q = useQuasar()

// Error service
const $errorService = ref(new ErrorService($q))
provide("$errorService", $errorService)

// Auth service
const $authService = ref(new AuthenticationService($q, $errorService))
provide("$authService", $authService)

// Quasar
provide("$q", $q)

// Set up router
setupRouter($authService.value)

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
