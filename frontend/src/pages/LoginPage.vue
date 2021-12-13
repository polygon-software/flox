<template>
  <q-page class="flex flex-center">
    <q-card
      class="items-center text-center"
    >
      <h5
        class="q-pa-sm q-ma-none"
      >
        {{ $t('welcome_bigabig') }}</h5>
      <!-- Login Card -->
      <LoginForm
        v-if="!signup"
        class="row q-pa-md items-center"
        @submit="onLogin"
      />

      <b
        v-if="!signup"
        style="margin-top: 0; padding: 0"
      >
        {{ $t('no_account_yet') }}
      </b>

      <!-- Signup Card -->
      <q-card class="row q-pa-md q-ma-md justify-center flex items-center">
        <SignupForm
          v-if="signup"
          @submit="onSignup"
        >
        </SignupForm>
        <q-btn
          v-if="!signup"
          :label="$t('signup')"
          color="transparent"
          text-color="primary"
          @click="signup = true"
          flat
        />
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref, } from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import LoginForm from 'components/forms/LoginForm.vue'
import SignupForm from 'components/forms/SignupForm.vue'

const $authService: AuthenticationService = inject('$authService')
const $routerService: RouterService = inject('$routerService')

const signup = ref(false)


/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username
 * @param {string} password - the authentication's password
 * @returns {void}
 */
async function onLogin({username, password}: {username: string, password: string}){
  await $authService.login(username, password)

  // Redirect to main page
  await $routerService.routeTo(ROUTES.MAIN)
}

/**
 * Registers a new authentication using the given data and opens the corresponding e-mail verification dialog
 * @param {string} username - the authentication's chosen username
 * @param {string} email - the authentication's e-mail address
 * @param {string} password_repeat - the authentication's chosen password
 * @returns {void}
 */
async function onSignup({username, email, password_repeat}:{username: string, email: string, password_repeat:string}){
  await $authService.signUp(username, email, password_repeat);
  // TODO: close signup
}

</script>
