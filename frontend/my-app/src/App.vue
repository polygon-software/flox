<template>
<!--  <MainPage/>-->
  <LoginPage/>
</template>

<script setup lang="ts">
// import MainPage from "./pages/MainPage"
import LoginPage from "./pages/LoginPage"
import {useQuasar} from "quasar";
import {AuthenticationService} from "@/plugins/AuthService";
import {provide} from "vue";

const quasar = useQuasar()

// Global Variables
provide("$q", quasar)
provide("$authService", new AuthenticationService(quasar))

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
