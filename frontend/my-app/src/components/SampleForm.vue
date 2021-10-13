<template>
  <q-card class="q-pa md" style="width: 300px; margin-left: 10px">
    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
    >
      <q-input
          filled
          v-model="name"
          label="Name"
          hint="Name and surname"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
          filled
          type="number"
          v-model="age"
          label="Age"
          lazy-rules
          :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 100 || 'Please type a real age'
        ]"
      />
      <q-btn label="Submit" type="submit" color="primary"/>

    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import {CREATE_USER}  from "@/data/MUTATIONS";
import { ref } from 'vue'

// "ref" needed to pass by reference / make reactive
let name = ref(null);
let age = ref(null);

// "Create" Mutation
const { mutate: createUser } = useMutation(CREATE_USER)

// Upon submit, send GraphQL mutation
function onSubmit () {
  console.log("SUBMIT with data", name.value, age.value)
  createUser({
      name: name.value,
      age: Number(age.value)
  })
}


</script>

<style scoped>

</style>
