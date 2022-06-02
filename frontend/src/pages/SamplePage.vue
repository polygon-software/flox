<template>
  <q-page class="flex flex-center">
    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Form example -->
    <SampleForm/>
  </q-page>
</template>

<script setup lang="ts">
import ModuleStatus from 'components/sample/ModuleStatus.vue';
import SampleForm from 'components/sample/SampleForm.vue';
</script>
