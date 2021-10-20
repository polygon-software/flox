<template>
  <router-view/>
<!--    <MainPage v-if="$authService.isLoggedIn()"/>-->
<!--    <LoginPage v-else/>-->
</template>

<script setup lang="ts">
// import MainPage from "./pages/MainPage.vue"
// import LoginPage from "./pages/LoginPage.vue"
import {useQuasar} from "quasar";
import {AuthenticationService} from "@/services/AuthService";
import {provide, ref} from "vue";
import {ErrorService} from "@/services/ErrorService";
import { useRouter } from 'vue-router'

const $q = useQuasar()

// Error service
const $errorService = ref(new ErrorService($q))
provide("$errorService", $errorService)

// Auth service
const $authService = ref(new AuthenticationService($q, $errorService))
provide("$authService", $authService)

// Quasar
provide("$q", $q)


const router = useRouter()

// Navigation guards
router.beforeEach((to) => {
  // TODO cleaner
  if(to.path != '/login' && !$authService.value.isLoggedIn()){
    return '/login'
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
