<template>
  <q-page class="flex flex-start">
    <div
      class="q-pa-lg full-width row justify-center"
      style="margin-top: 50px"
    >
      <AdminRejectedDossierTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import AdminRejectedDossierTable from 'components/tables/AdminRejectedDossierTable.vue';
</script>
