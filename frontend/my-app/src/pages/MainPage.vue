<template>
  <q-page class="flex flex-center">
    <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
    <SampleTable/>
    <SampleForm/>
  </q-page>
</template>

<script setup lang="ts">
import SampleTable from "../components/SampleTable"
import SampleForm from "../components/SampleForm"
</script>

<style scoped>

</style>
