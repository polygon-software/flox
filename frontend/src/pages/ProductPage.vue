<template>
  <q-page class="flex flex-center">
    <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
    <div class="column">
      <div class="row q-pa-md">
        <ProductCardDetail :product="product"/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ProductCardDetail from 'components/dialogs/ProductCardDetailDialog.vue';
const props = defineProps({
  product: {
    required: true,
    type: Object,
  }
})

</script>
