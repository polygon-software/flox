<template>
  <div class="column">
    <b>Log in</b>
    <q-input label="Username" v-model="username"/>
    <q-input label="Password" v-model="password" type="password"/>
    <q-btn color="primary" label="Log in" @click="onSubmit"/>
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import {ref} from "vue";

let username = ref('')
let password = ref('')

const emit = defineEmits(['submit'])

/**
 * TODO
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
