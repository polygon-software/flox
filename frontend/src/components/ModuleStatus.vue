<template>
  <!-- This is a test component for showing Flox modules' status & options-->
  <q-card class="q-column q-pa-md text-center q-ma-md" style="width: 300px">
    <h5
      class="q-ma-none q-mb-md q-mt-sm"
    >
      Flox Modules:
    </h5>
    <q-separator/>

    <q-item
      class="row justify-between items-center"
      v-for="module in modules"
      :key="module"
    >
      <q-icon name="check" color="positive" size="20px"/>

      <div class="column">

        <q-item-label>
          {{ module }}
        </q-item-label>
        <q-item-label caption>
          {{ moduleOptions[module] }}
        </q-item-label>
      </div>
      <div style="width: 20px"/>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">

import {floxModuleOptions, floxModules} from '../flox/flox';

// Active modules
const modules = floxModules()

// Options of modules
const moduleOptions = floxModuleOptions()
</script>
