<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
    <MenuBar :logged-in="$authService.isLoggedIn()"/>
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
import LoginForm from "../components/forms/LoginForm.vue"
import SignupForm from "../components/forms/SignupForm.vue"
import MenuBar from "../components/menu/MenuBar"
import {inject} from 'vue'
import {AuthenticationService} from "@/services/AuthService";

const $authService: AuthenticationService = inject('$authService')

/**
 * Logs in the given user
 * @param username {string} - the user's username
 * @param password {string} - the user's password
 */
async function onLogin({username, password}: {username: string, password: string}){
  await $authService.value.login(username, password)
}


/**
 * Registers a new user using the given data and opens the corresponding e-mail verification dialog
 * @param username {string} - the user's chosen username
 * @param email {string} - the user's e-mail address
 * @param password {string} - the user's chosen password
 */
async function onSignup({username, email, password}:{username: string, email: string, password:string}){
  $authService.value.signUp(username, email, password);
}

</script>

<style scoped>

</style>
