<template>
  <q-btn
    label="SignUp"
    @click="confirm_modal = true"
    color="primary"
  ></q-btn>
  <q-dialog v-model="confirm_modal">
    <q-card>
      <q-card-section>
        <q-input v-model="email"/>
        <q-input v-model="username"/>
        <q-input v-model="password"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Sign Up" v-close-popup @click="onSignup"/>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn flat label="Log in" v-close-popup @click="onLogin"/>
        <qrcode-vue value="asdf" level="H" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {AuthenticationService} from "@/plugins/auth";
import {useQuasar} from "quasar";
import QrcodeVue from 'qrcode.vue'

const $q = useQuasar()

const authenticationService = new AuthenticationService()

let confirm_modal = ref(false);
let email = ref("")
let username = ref("")
let password = ref("")

async function onLogin(){
  await authenticationService.login(username.value, password.value);
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
 *
 * @param code {string} - E-mail verification code
 */
function onConfirmMFACode(code){
  console.log("MFA code:", code)
  authenticationService.confirm(code)
}

async function onSignup(){
  await authenticationService.signUp(username.value, email.value, password.value);
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
