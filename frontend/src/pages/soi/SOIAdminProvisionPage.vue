<template>
  <q-page class="flex flex-start">
    <div
      class="q-pa-lg full-width row justify-center"
      style="margin-top: 50px"
    >
      <AdminProvisionTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AdminProvisionTable from 'components/tables/AdminProvisionTable.vue';
</script>
