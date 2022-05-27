<template>
  <q-page class="flex flex-center column">

    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Login Card -->
    <q-card class="q-pa-md q-ma-md" style="width: 300px">
      <LoginForm @submit="onLogin"/>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'components/forms/LoginForm.vue'
import SignupForm from 'components/forms/SignupForm.vue'
import {inject} from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import ModuleStatus from 'components/ModuleStatus.vue';
const $authService: AuthenticationService = inject('$authService')
const $routerService: RouterService = inject('$routerService')


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

// TODO
// /**
//  * Registers a new authentication using the given data and opens the corresponding e-mail verification dialog
//  * @param {string} username - the authentication's chosen username
//  * @param {string} email - the authentication's e-mail address
//  * @param {string} password_repeat - the authentication's chosen password
//  * @returns {void}
//  */
// async function onSignup({username, email, password_repeat}:{username: string, email: string, password_repeat:string}){
//   await $authService.signUp(username, email, password_repeat);
// }

</script>
