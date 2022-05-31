<template>
  <q-page class="flex flex-center column">
    <!-- Signup Card -->
    <q-card class="q-pa-md q-ma-md" style="width: 300px">
      <SignupForm
        @submit="onSignup"
        @cancel="onCancel"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject} from 'vue'
import {AuthenticationService} from '../flox/modules/auth/services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import SignupForm from 'src/flox/modules/auth/components/forms/SignupForm.vue';
const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')

/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username (may be identical to the e-mail)
 * @param {string} email - the authentication's email
 * @param {string} password - the authentication's password
 * @returns {void}
 */
async function onSignup({username, email, password}: {username: string, email: string, password: string}){
  console.log('got', username, email, password)
  await $authService?.signUp(username, email, password)

  // Redirect to success page
  await $routerService?.routeTo(ROUTES.SUCCESS) // TODO
}

/**
 * On cancel, routes back to login page
 * @returns {Promise<void>} - done
 */
async function onCancel() {
  await $routerService?.routeTo(ROUTES.LOGIN)
}
</script>
