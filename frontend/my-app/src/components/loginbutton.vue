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
        <q-btn flat label="Register" v-close-popup @click="async ()=>{user = await signUp(username, email, password); confirm_code = true}"/>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn flat label="login" v-close-popup @click="()=>{user = login(email, password)}"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirm_code">
    <q-card>
      <q-card-section>
        <q-input v-model="code"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="confirm" v-close-popup @click="()=>{confirm(code, user)}"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import {login, signUp, confirm} from "@/plugins/auth.ts";

import {ref} from "vue";


let user = ref(null);

let confirm_modal = ref(false);
let confirm_code = ref(false);
let email = ref("")
let username = ref("")
let password = ref("")
let code = ref("")


</script>

<style scoped>

</style>
