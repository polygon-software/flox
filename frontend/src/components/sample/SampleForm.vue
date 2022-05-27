<template>
  <q-card  style="width: 300px; margin-left: 10px">
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
import {CREATE_USER}  from '../../data/MUTATIONS';
import { ref } from 'vue'
import {executeMutation} from '../../helpers/data-helpers';

// "ref" needed to pass by reference / make reactive
let name = ref(null);
let age = ref(null);


/**
 * Upon submit, send GraphQL mutation
 * @returns {void}
 */
async function onSubmit (){
  if(!process.env.SERVER){
    await executeMutation(
      CREATE_USER,
      {
        name: name.value,
        age: Number(age.value)
      }
    )
  }
}


</script>
