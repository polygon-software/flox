<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Projects -->
    <h5>{{ $t('dashboard.project') }} {{ projectId }}</h5>

    <ProjectTable/>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import ProjectTable from 'components/tables/ProjectTable.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  projectId: {
    required: true,
    type: String
  }
})
</script>
