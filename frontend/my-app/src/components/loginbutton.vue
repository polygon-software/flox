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
        <q-input v-model="password"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Register" v-close-popup @click="()=>{user = signUp(email, password)}"/>
      </q-card-actions>
      <q-card-actions align="right">
        <q-btn flat label="login" v-close-popup @click="()=>{user = login(email, password)}"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {login, signUp} from "@/plugins/auth.ts";

import {ref} from "vue";


let user;

let confirm_modal = ref(false);
let email = ref("")
let password = ref("")



</script>

<style scoped>

</style>
