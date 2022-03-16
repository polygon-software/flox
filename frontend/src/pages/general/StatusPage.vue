<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title -->
    <h5>{{ $t('status.title') }} {{ stationId }}</h5>

    <ClientConnectivityTable :cli="stationId"/>
    <LogFilesTable/>

  </q-page>
</template>

<script setup lang="ts">
import ClientConnectivityTable from 'components/tables/ClientConnectivityTable.vue';
import LogFilesTable from 'components/tables/LogFilesTable.vue';
import {defineProps} from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})

</script>
