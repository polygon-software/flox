<template>
  <q-page class="flex flex-start">
    <div
      class="q-pa-lg full-width row justify-center"
      style="margin-top: 50px"
    >
      <AdminEmployeeTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import AdminEmployeeTable from 'components/tables/AdminEmployeeTable.vue';
</script>
