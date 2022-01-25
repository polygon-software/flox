<template>
  <div class="q-pa-sm">
    <div v-if="searchFilter !== ''" class="q-pa-sm">
      {{ $t('products.results_for') }} "<strong> {{ searchFilter }} </strong>"
    </div>
    <div class="row q-pa-sm q-gutter-sm justify-center">
      <ProductCard
        v-for="product in filteredProducts"
        :key="`${product.uuid}-${searchFilter}`"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from 'components/product/ProductCard.vue';
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { computed, inject, Ref } from 'vue';
import { ALL_PRODUCTS } from 'src/data/queries/PRODUCT';
import { RouterService } from 'src/services/RouterService';
import { Product } from 'src/data/types/Product';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../../shared/definitions/ENUM';

const $routerService: RouterService|undefined = inject('$routerService')

const queryResult = subscribeToQuery(ALL_PRODUCTS) as Ref<Record<string, unknown>[]>

const searchFilter = computed(() => {
  return $routerService?.getQuery().search as string ?? '';
})

const realProducts = computed(() => {
  const productRecords = queryResult?.value ?? []
  return productRecords.map((record) => new Product(
    record.title as string,
    record.description as string,
    record.brand as string,
    record.category as CATEGORY,
    record.value as number,
    record.currency as CURRENCY,
    record.start as Date,
    record.end as Date,
    record.pictures as Record<string, string>[],
    record.status as PRODUCT_STATUS,
    record.sponsored as boolean,
    record.directBuyLink as string,
    record.directBuyLinkCLicks as number,
    record.directBuyLinkMaxClicks as number,
    record.directBuyLinkCost as number,
    record.directBuyLinkMaxCost as number,
    record.brandLink as string,
    record.brandLinkClicks as number,
    record.brandLinkMaxClicks as number,
    record.brandLinkCost as number,
    record.brandLinkMaxCost as number,
    record.minBet as number,
    record.maxBet as number,
    record.tags as string[],
    record.comments as Record<string, string>[],
    record.likes as number,
  ))
})

const filteredProducts = computed(() => {
  let products = realProducts.value
  if(searchFilter.value !== ''){
    const filter = searchFilter.value.toLowerCase();
    products = products.filter((product) =>
      product.title.toLowerCase().includes(filter) || product.description.toLowerCase().includes(filter)
    )
  }
  return products;
})
</script>
