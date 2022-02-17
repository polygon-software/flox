<template>
  <q-page class="flex flex-center">
    <q-card
      class="column items-center text-center"
    >
      <h5
        class="q-pa-sm q-ma-none"
      >
        {{ $t('greetings.welcome_datavis') }}</h5>
      <!-- Login Card -->
      <LoginForm
        class="row q-pa-md items-center"
        @submit="onLogin"
      />

      <strong
        style="margin-top: 0; padding: 0"
      >
        {{ $t('authentication.no_account_yet') }}
      </strong>

      <q-btn
        v-if="!signup"
        :label="$t('authentication.signup')"
        color="transparent"
        text-color="primary"
        flat
        rounded
        @click="toSignup"
      />

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, } from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import LoginForm from 'components/forms/LoginForm.vue'

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')

/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username
 * @param {string} password - the authentication's password
 * @async
 * @returns {void}
 */
async function onLogin({username, password}: {username: string, password: string}): Promise<void>{
  await $authService?.login(username, password)

  // Redirect to main page
  await $routerService?.routeTo(ROUTES.MAIN)
}

/**
 * Go to signup Page
 * @returns {Promise<void>} - done
 */
async function toSignup(){
  // Redirect to signup page
  await $routerService?.routeTo(ROUTES.SIGNUP)
}

</script>
