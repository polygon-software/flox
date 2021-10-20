<template>
  <router-view/>
</template>

<script setup lang="ts">
import {useQuasar} from "quasar";
import {AuthenticationService} from "@/services/AuthService";
import {provide, ref} from "vue";
import {ErrorService} from "@/services/ErrorService";
import { useRouter } from 'vue-router'
import {ROUTES} from "@/router/ROUTES";

const $q = useQuasar()

// Error service
const $errorService = ref(new ErrorService($q))
provide("$errorService", $errorService)

// Auth service
const $authService = ref(new AuthenticationService($q, $errorService))
provide("$authService", $authService)

// Quasar
provide("$q", $q)

// Router navigation guards
const router = useRouter()

router.beforeEach((to) => {
  const loginPath = ROUTES.LOGIN.path

  if(to.path != loginPath && !$authService.value.isLoggedIn()){
    return loginPath
  }
})
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
