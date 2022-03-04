<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title -->
    <h5>{{ $t('dashboard.files') }} {{ stationId.toUpperCase() }}</h5>

    <FilesTable/>

  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import FilesTable from 'components/tables/FilesTable.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})
</script>
