<template>
  <q-page
    class="flex flex-start q-pa-xl">
    <div
      class="q-pa-md full-width"
    >
      <!-- Employee Overview -->
      <EmployeeTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import EmployeeTable from 'components/tables/EmployeeTable.vue';

</script>
