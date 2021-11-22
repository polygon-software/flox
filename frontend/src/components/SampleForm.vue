<template>
  <q-card  style="width: 300px; margin-left: 10px">
    <q-form
        class="q-gutter-md"
        @submit="onSubmit"
    >
      <q-input
          v-model="name"
          filled
          label="Name"
          hint="Name and surname"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        v-model="age"
        filled
        type="number"
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
import {CREATE_USER}  from '../data/MUTATIONS/USER';
import { ref } from 'vue'
import {executeMutation} from '../helpers/data-helpers';

// "ref" needed to pass by reference / make reactive
let name = ref(null);
let age = ref(null);


// Upon submit, send GraphQL mutation
function onSubmit () : void{
  if(!process.env.SERVER){
    void executeMutation(
      CREATE_USER,
      {
        name: name.value,
        age: Number(age.value)
      }
    )
  }
}


</script>
