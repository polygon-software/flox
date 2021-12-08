<template>
  <q-page
    class="flex flex-start q-pa-xl">
    <div
      class="q-pa-md full-width"
    >
      <!-- Own info -->
      <CompanyInfoCard/>

      <!-- Employee Data Overview -->
      <EmployeeDataTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import EmployeeDataTable from 'components/tables/EmployeeDataTable.vue';
import CompanyInfoCard from "components/cards/CompanyInfoCard.vue";

</script>
