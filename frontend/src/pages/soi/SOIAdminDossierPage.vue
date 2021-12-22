<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-lg full-width row justify-center"
      style="margin-top: 50px"
    >
      <AdminDossierTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import AdminDossierTable from 'components/tables/AdminDossierTable.vue';
</script>
