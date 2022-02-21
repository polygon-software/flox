<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Project name -->
    <h5>{{ parametersId }}</h5>
    <UserDataForm/>
    <AlertContactsForm/>
  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import UserDataForm from 'components/forms/UserDataForm.vue';
import AlertContactsForm from 'components/forms/AlertContactsForm.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  parametersId: {
    required: true,
    type: String
  }
})
</script>
