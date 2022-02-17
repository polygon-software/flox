<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Projects -->
    <h5>{{ $t('dashboard.project') }}</h5>

    <p>TODO, Project is {{ projectId }}</p>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  projectId: {
    required: true,
    type: String
  }
})
</script>
