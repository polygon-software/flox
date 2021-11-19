<template>
  <q-page class="flex flex-center">
    <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
    <div class="column">
      <div class="row q-pa-md">
        <ProductFeed/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SampleTable from 'components/SampleTable.vue'
import SampleForm from 'components/SampleForm.vue'
import SampleSubscriptionTable from 'components/SampleSubscriptionTable.vue'
import ProductFeed from 'components/product/ProductFeed.vue';

</script>
