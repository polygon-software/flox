<template>
  <q-page class="flex flex-center">

    <!-- Active Flox modules -->
    <ModuleStatus/>

    <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
    <div class="column">
      <div class="row q-pa-md">
        <SampleTable/>
        <SampleForm/>
      </div>

      <div class="q-pa-md">
        <SampleSubscriptionTable/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SampleTable from 'components/sample/SampleTable.vue'
import SampleForm from 'components/sample/SampleForm.vue'
import SampleSubscriptionTable from 'components/sample/SampleSubscriptionTable.vue'
</script>
