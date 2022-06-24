<template>
  <q-page class="flex flex-center column">
    <!-- Login Card -->
    <q-card class="q-pa-md q-ma-md" style="width: 300px">
      <LoginForm @submit="onLogin"/>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'src/flox/modules/auth/components/forms/LoginForm.vue'
import {inject} from 'vue'
import {AuthenticationService} from '../flox/modules/auth/services/AuthService';
const $authService: AuthenticationService|undefined = inject('$authService')

/**
 * Logs in the given authentication
 * @param {string} identifier - the authentication's username or e-mail
 * @param {string} password - the authentication's password
 * @returns {void}
 */
async function onLogin({identifier, password}: {identifier: string, password: string}){
  await $authService?.login(identifier, password)
}
</script>
