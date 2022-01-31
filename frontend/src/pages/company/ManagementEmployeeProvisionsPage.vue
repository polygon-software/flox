<template>
  <q-page
    class="flex flex-start q-pa-xl">
    <div
      class="q-pa-md full-width"
    >
      <!-- Own info -->
      <CompanyInfoCard/>

      <!-- Employee Task Overview -->
      <EmployeeTaskTable/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import EmployeeTaskTable from 'components/tables/EmployeeProvisionsTable.vue';
import CompanyInfoCard from 'components/cards/CompanyInfoCard.vue';

</script>
