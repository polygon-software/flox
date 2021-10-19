<template>
  <div class="column q-pa-sm" style="width: 250px; height: 400px;">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">Sign Up</h5>
    <!-- TODO enforce password/regex email etc. rules -->
    <q-form
          @submit="onSubmit"
          class="q-gutter-md"
      >
      <q-input
          dense
          label="Username"
          v-model="username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter a username']"

      />
      <q-input
          dense
          label="E-Mail"
          v-model="email"
      />
      <q-input
          dense
          label="Password"
          v-model="password"
          type="password"
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
      <q-btn
          style="margin-top: 25px"
          color="primary"
          label="Sign up"
          type="submit"
      />
      </q-form>
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import {ref} from "vue";

let username = ref('')
let email = ref('')
let password = ref('')
let passwordRepeat = ref('')

const emit = defineEmits(['submit'])

/**
 * TODO
 */
function onSubmit(){
  emit('submit', {
    username: username.value,
    email: email.value,
    password: password.value,
  })
}

</script>

<style scoped>

</style>
