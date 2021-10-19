<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
    <MenuBar :logged-in="loggedIn"/>
    <MainPage v-if="loggedIn"/>
    <LoginPage v-else/>
  </q-layout>

</template>

<script setup lang="ts">
import MainPage from "./pages/MainPage.vue"
import LoginPage from "./pages/LoginPage.vue"
import MenuBar from "./components/menu/MenuBar.vue"
import {useQuasar} from "quasar";
import {AuthenticationService} from "@/plugins/AuthService";
import {computed, provide, ref} from "vue";

const $q = useQuasar()
const $authService = ref(new AuthenticationService($q))

// Global Variables
provide("$q", $q)
provide("$authService", $authService)


// Login state
// eslint-disable-next-line no-unused-vars
const loggedIn = computed(() => {
 return $authService.value.isLoggedIn();
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
