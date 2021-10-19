<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
    <q-page class="flex flex-center">
      <!-- Login Card -->
      <q-card class="q-pa-md q-ma-md">
        <LoginForm/>
      </q-card>

      <!-- Signup Card -->
      <q-card class="q-pa-md q-ma-md">
        <SignupForm/>
      </q-card>
    </q-page>
  </q-layout>
</template>

<script setup lang="ts">
import LoginForm from "../components/forms/LoginForm"
import SignupForm from "../components/forms/SignupForm"

</script>

<style scoped>

</style>
