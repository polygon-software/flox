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
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {computed, Ref} from 'vue';
import {ALL_PRODUCTS} from 'src/data/queries/PRODUCT';

const queryResult = subscribeToQuery(ALL_PRODUCTS) as Ref<Record<string, Array<Record<string, unknown>>>>|undefined

const products = computed(()=>{
  return queryResult && queryResult.value ? Object.values(queryResult.value) ?? [] : []
})
</script>
<style scoped>
</style>
