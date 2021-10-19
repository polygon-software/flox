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

let $authService = inject('$authService')
let $q = inject('$q')

async function onLogin({username, password}){
  await $authService.login(username, password)

  //TODO don't throw POST error
  $q.dialog({
    title: '2FA code',
    message: 'Please enter your e-mail verification code',
    cancel: true,
    persistent: true,
    prompt: {
      model: '',
      isValid: val => val.length >= 6,
      type: 'text'
    },
  }).onOk(input => {
    onVerifyEmail(input)
  })
}

/**
 * Confirm e-mail verification code
 * @param code {string} - E-mail verification code
 */
function onVerifyEmail(code){
  $authService.confirm(code)
}

/**
 * TODO
 * @param username
 * @param email
 * @param password
 */
async function onSignup({username, email, password}){
  await $authService.signUp(username, email, password);
  $q.dialog({
    title: 'Verification',
    message: 'Please enter your e-mail verification code',
    cancel: true,
    persistent: true,
    prompt: {
      model: '',
      isValid: val => val.length >= 6,
      type: 'text'
    },
  }).onOk(input => {
    onVerifyEmail(input)
  }).onCancel(() => {
    // TODO handle @thommann
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>

<style scoped>

</style>
