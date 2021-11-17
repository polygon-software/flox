<template>
  <q-page class="flex flex-center">
    <q-card
      class="items-center"
      style="height: 600px;"
    >
      <!-- Login Card -->
      <LoginForm
        v-if="!signup"
        class="row q-pa-md items-center"
        @submit="onLogin"
      />

      <!-- Signup Card -->
      <q-card class="row q-pa-md q-ma-md justify-center flex items-center">
        <SignupForm
          v-if="signup"
          @submit="onSignup"
        />
        <q-btn
          v-if="!signup"
          :label="$t('signup')"
          color="primary"
          text-color="black"
          @click="signup = true"
        />
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref, Ref} from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import LoginForm from 'components/forms/LoginForm.vue'
import SignupForm from 'components/forms/SignupForm.vue'

const signup = ref(false)
const $authService: Ref<AuthenticationService> = inject<Ref<AuthenticationService>>('$authService')
const $routerService: Ref<RouterService> = inject<Ref<RouterService>>('$routerService')

/**
 * Logs in the given authentication
 * @param username {string} - the authentication's username
 * @param password {string} - the authentication's password
 */
async function onLogin({username, password}: {username: string, password: string}){
  await $authService.value.login(username, password)

  // Redirect to main page
  await $routerService.value.routeTo(ROUTES.MAIN)
}


/**
 * Registers a new authentication using the given data and opens the corresponding e-mail verification dialog
 * @param username {string} - the authentication's chosen username
 * @param email {string} - the authentication's e-mail address
 * @param password_repeat {string} - the authentication's chosen password
 */
async function onSignup({username, email, password_repeat}:{username: string, email: string, password_repeat:string}){
  await $authService.value.signUp(username, email, password_repeat);
}

</script>
