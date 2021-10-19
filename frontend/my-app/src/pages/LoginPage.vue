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
      <q-card class="q-pa-md q-ma-md">
        <q-btn label="Logout" @click="logout"/>
      </q-card>

    </q-page>
  </q-layout>
</template>

<script setup lang="ts">
import LoginForm from "../components/forms/LoginForm.vue"
import SignupForm from "../components/forms/SignupForm.vue"
import { inject } from 'vue'

// eslint-disable-next-line no-unused-vars
let $authService: any = inject('$authService')
let $q: any = inject('$q')

async function onLogin({username, password}: {username: string, password: string}){
  await $authService.login(username, password)

  //TODO don't throw POST error
  $q.dialog({
    title: '2FA code',
    message: 'Please enter your e-mail verification code',
    cancel: true,
    persistent: true,
    prompt: {
      model: '',
      isValid: (val: string ) => val.length >= 6,
      type: 'text'
    },
  }).onOk((input: string) => {
    onVerifyEmail(input)
  })
}

/**
 * Confirm e-mail verification code
 * @param code {string} - E-mail verification code
 */
function onVerifyEmail(code: string){
  $authService.confirm(code)
}

/**
 * TODO
 * @param username
 * @param email
 * @param password
 */
async function onSignup({username, email, password}:{username: string, email: string, password:string}){
  await $authService.signUp(username, email, password);
  $q.dialog({
    title: 'Verification',
    message: 'Please enter your e-mail verification code',
    cancel: true,
    persistent: true,
    prompt: {
      model: '',
      isValid: (val: string) => val.length >= 6,
      type: 'text'
    },
  }).onOk((input: string) => {
    onVerifyEmail(input)
  }).onCancel(() => {
    // TODO handle @thommann
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

function logout(){
  $authService.logout();
}

</script>

<style scoped>

</style>
