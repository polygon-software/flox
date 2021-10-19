<template>
  <div class="column">
    <b>Sign up</b>
    <q-input label="Username" v-model="username"/>
    <q-input label="E-Mail" v-model="email"/>
    <q-input label="Password" v-model="password" type="password"/>
    <q-btn
        style="margin-top: 5px"
        color="primary"
        label="Sign up"
        @click="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import {ref} from "vue";

let username = ref('')
let email = ref('')
let password = ref('')

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
