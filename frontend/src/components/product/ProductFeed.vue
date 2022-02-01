<template>
  <div class="q-pa-sm">
    <ProductCard
      v-for="product in products"
      :key="product.uuid"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from 'components/product/ProductCard.vue';
import { fetchAllProducts } from 'src/helpers/api-helpers';

const products = fetchAllProducts()
</script>
<style scoped>
</style>
