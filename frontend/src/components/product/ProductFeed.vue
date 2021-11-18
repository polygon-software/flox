<template>
  <q-card class="q-pa-sm">
    <ProductCard
      v-for="product in products"
      :key="product.uuid"
      :product="product"
      class="q-mb-xl"

    />
  </q-card>
</template>

<script setup lang="ts">
import ProductCard from 'components/product/ProductCard.vue';

// TODO get from backend.
const products = [
  {
    uuid: 'abc-1234',
    name: 'Fancy Watch',
    value: 12000
  },
  {
    uuid: 'casdf-543',
    name: 'Cool car',
    value: 40000
  },
  {
    uuid: 'def-665',
    name: 'Painting',
    value: 2000
  },
]

</script>

<style scoped>

</style>
