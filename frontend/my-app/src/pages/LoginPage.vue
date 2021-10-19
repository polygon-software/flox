<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
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
  </q-layout>
</template>

<script setup lang="ts">
import LoginForm from "../components/forms/LoginForm"
import SignupForm from "../components/forms/SignupForm"
import { inject } from 'vue'

const $authService = inject('$authService')
// const $q = inject('$q')

async function onLogin({username, password}){
  await $authService.value.login(username, password)

  // TODO all to service
  // //TODO don't throw POST error
  // $q.dialog({
  //   title: '2FA code',
  //   message: 'Please enter your e-mail verification code',
  //   cancel: true,
  //   persistent: true,
  //   prompt: {
  //     model: '',
  //     isValid: val => val.length >= 6,
  //     type: 'text'
  //   },
  // }).onOk(input => {
  //   // onVerifyEmail(input)
  // })
}


/**
 * Registers a new user using the given data and opens the corresponding e-mail verification dialog
 * @param username {string} - The user's chosen username
 * @param email {string} - The user's e-mail address
 * @param password {string} - the user's chosen password
 */
async function onSignup({username, email, password}){
  $authService.value.signUp(username, email, password);
}

</script>

<style scoped>

</style>
