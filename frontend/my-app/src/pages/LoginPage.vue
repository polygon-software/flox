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
import LoginForm from "../components/forms/LoginForm.vue"
import SignupForm from "../components/forms/SignupForm.vue"
import { inject } from 'vue'

const $authService: any = inject('$authService')

async function onLogin({username, password}: {username: string, password: string}){
  await $authService.value.login(username, password)
}


/**
 * Registers a new user using the given data and opens the corresponding e-mail verification dialog
 * @param username {string} - The user's chosen username
 * @param email {string} - The user's e-mail address
 * @param password {string} - the user's chosen password
 */
async function onSignup({username, email, password}:{username: string, email: string, password:string}){
  $authService.value.signUp(username, email, password);
}

</script>

<style scoped>

</style>
