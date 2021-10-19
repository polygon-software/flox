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

import {useQuasar} from "quasar";
import {AuthenticationService} from "@/plugins/auth";
const $q = useQuasar()

const authenticationService = new AuthenticationService()

async function onLogin({username, password}){
  console.log("LOGIN with", username, password)
  await authenticationService.login(username, password)

  //TODO
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
    onConfirmMFACode(input)
  })
}

/**
 * TODO
 * @param code {string} - E-mail verification code
 */
function onConfirmMFACode(code){
  console.log("MFA code:", code)
  authenticationService.confirm(code)
}

async function onSignup({username, email, password}){
  console.log("SIGN UP with", username, email, password) // TODO some stuff here
  await authenticationService.signUp(username, email, password);
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
    onConfirmMFACode(input)
  }).onCancel(() => {
    // TODO handle @thommann
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

</script>

<style scoped>

</style>
