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
import gql from 'graphql-tag'

let name = null
let age = null

// "Create" Mutation
const { mutate: createUser } = useMutation(gql`
  mutation {
    create (createUserInput: {age: 12, name: "test"}) {
      id
    }
  }
`)

// Upon submit, send GraphQL mutation
function onSubmit () {
  createUser({
    createUserInput: {
      name: this.name,
      age: this.age
    }
  }
  )
}


</script>

<style scoped>

</style>
