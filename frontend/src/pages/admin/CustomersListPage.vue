<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title -->
    <h5>{{ $tc('dashboard.customer', 0) }}</h5>

    <!-- List of customers -->
    <CustomersTable/>

  </q-page>
</template>

<script setup lang="ts">
import CustomersTable from 'components/tables/CustomersTable.vue';
</script>
