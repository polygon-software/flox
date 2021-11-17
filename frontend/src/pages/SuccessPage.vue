<template>
  <h2>Registrierung bestätigt</h2>
  <h4>Deine Registrierung wird nun bearbeitet! Du wirst nun automatisch zum Login-Screen zurückgeleitet.</h4>
  <q-icon name="done" size="300px" color="green" class="absolute-center"/>

  <q-btn
    v-if="!startSignup"
    color="primary"
    label="Zurück zu Login"
    @click="backToLogin"
  />
</template>

<script setup lang="ts">
import {inject} from 'vue'
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
const $routerService: RouterService = inject('$routerService')


async function backToLogin({username}:{username: string}): Promise<void>{
  // Redirect to login page
  await $routerService.routeTo(ROUTES.LOGIN)
}
</script>

<style scoped>

</style>
