<template>
  <div class="column q-pa-sm" style="width: 250px; height: 430px;">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('login') }}
    </h5>
    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
    >
      <q-input
          label="Username"
          v-model="username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter your username']"
      />
      <q-input
          label="Password"
          v-model="password"
          type="password"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please enter your password']"
      />
      <q-btn
          style="margin-top: 5px"
          color="primary"
          label="Log in"
          type="submit"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import {ref} from "vue";

let username = ref('')
let password = ref('')

const emit = defineEmits(['submit'])

/**
 * On submit, pass entered data outwards
 */
function onSubmit(){
  emit('submit', {
    username: username.value,
    password: password.value,
  })
}

</script>

<style scoped>

</style>
