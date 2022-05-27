<template>
  <q-page class="flex flex-center">

    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
    <div class="column">
      <SampleForm/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SampleForm from 'components/sample/SampleForm.vue'
import ModuleStatus from 'components/sample/ModuleStatus.vue';
</script>
