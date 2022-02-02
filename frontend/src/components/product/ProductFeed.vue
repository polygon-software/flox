<template>
  <div class="q-pa-sm">
    <ProductCard
      v-for="product in allProducts"
      :key="product.uuid"
      :product="product"
    />
  </div>
</template>

<script setup lang="ts">
import ProductCard from 'components/product/ProductCard.vue';
import { fetchAllProducts } from 'src/helpers/api-helpers';

const allProducts = fetchAllProducts()
</script>
<style scoped>
</style>
