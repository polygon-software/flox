<template>
  <q-page class="flex flex-center">
    <!-- Login Card -->
    <q-card class="q-pa-md q-ma-md">
      <LoginForm @submit="onLogin"/>
    </q-card>

    <!-- Signup Card -->
    <q-card class="q-pa-md q-ma-md">
      <SignupForm @submit="onSignup"/>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'components/forms/LoginForm.vue'
import SignupForm from 'components/forms/SignupForm.vue'
import {inject, Ref} from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

const $authService: Ref<AuthenticationService> = inject('$authService')
const $routerService: Ref<RouterService> = inject('$routerService')

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
 * @param password {string} - the authentication's chosen password
 */
async function onSignup({username, email, password}:{username: string, email: string, password:string}){
  await $authService.value.signUp(username, email, password);
}

</script>
