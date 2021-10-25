<template>
  <q-input
      dense
      label="Password"
      v-model="password"
      type="password"
      lazy-rules="ondemand"
      :rules="[val => PASSWORD_REGEX.test(val) || 'Not ok']"
  />
  <q-input
      dense
      label="Repeat Password"
      v-model="passwordRepeat"
      type="password"
      lazy-rules
      :rules="[
          val => val === password || 'Passwords must be identical',
        ]"
  />
</template>

<script setup lang="ts">
import {PASSWORD_REGEX} from "@/helpers/REGEX";
import {ref} from "vue";

let password = ref('')
let passwordRepeat = ref('')
</script>

<style scoped>
</style>
