<template>
  <q-card class="q-column q-pa-md text-center" style="width: 300px">
    <h5
      class="q-ma-none q-mb-md"
    >
      Active Flox Modules:
    </h5>
    <q-separator/>

    <q-item
      class="row justify-between items-center"
      v-for="module in modules"
      :key="module"
    >
      <q-icon name="check" color="positive" size="20px"/>
      <p>{{ module }}</p>
      <div style="width: 20px"/>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">

import {floxModules} from '../flox/flox';

const modules = floxModules()
// TODO

</script>

<style scoped>

</style>
