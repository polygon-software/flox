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
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirm_code">
    <q-card>
      <q-card-section>
        <q-input v-model="code"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="confirm" v-close-popup @click="onConfirmMFACode"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">


import {ref} from "vue";
import {AuthenticationService} from "@/plugins/auth";

const authenticationService = new AuthenticationService()

let confirm_modal = ref(false);
let confirm_code = ref(false);
let email = ref("")
let username = ref("")
let password = ref("")
let code = ref("")

function onLogin(){
  authenticationService.login(username.value, password.value);
}

function onSignup(){
  authenticationService.signUp(username, email, password);
}

function onConfirmMFACode(){
  authenticationService.confirm(confirm_code)
}

</script>

<style scoped>

</style>
