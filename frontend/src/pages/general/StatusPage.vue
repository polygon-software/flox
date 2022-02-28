<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title -->
    <h5>Status</h5>

    <ClientConnectivityTable/>
    <LogFilesTable/>

  </q-page>
</template>

<script setup lang="ts">
import ClientConnectivityTable from 'components/tables/ClientConnectivityTable.vue';
import LogFilesTable from 'components/tables/LogFilesTable.vue';

</script>
