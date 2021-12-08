<template>
  <q-page
    class="flex flex-start q-pa-xl">
    <div
      class="q-pa-md full-width"
    >
      <!-- Own info TODO-->
      <q-card
        class="full-width q-pa-sm"
        style="margin-bottom: 20px"
        flat
      >
        Eingeloggt als:
      </q-card>

      <!-- Employee Overview -->
      <EmployeeTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import EmployeeTable from 'components/tables/EmployeeTable.vue';

</script>
