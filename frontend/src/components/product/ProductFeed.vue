<template>
  <div class="q-pa-sm">
    <div v-if="searchFilter !== ''" class="q-pa-sm">
      {{ $t('products.results_for') }} "<strong> {{ searchFilter }} </strong>"
    </div>
    <div class="row q-gutter-sm q-pa-sm">
      <q-btn
        rounded
        :label="$t('products.filter_and_sort')"
        icon="sort"
        @click="openFilterPage"
      />
      <q-btn
        rounded
        :label="$t('products.reset_filter')"
        @click="resetFilter"
      />
    </div>
    <div class="col q-pa-sm q-gutter-sm justify-center">
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
import { computed, Ref } from 'vue';
import { ALL_PRODUCTS } from 'src/data/queries/PRODUCT';
import { Product } from 'src/data/types/Product';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

const queryResult = subscribeToQuery(ALL_PRODUCTS) as Ref<Record<string, unknown>[]>

const searchFilter = computed(() => {
  return route.query.search as string ?? '';
})


const realProducts = computed(() => {
  const productRecords = queryResult?.value ?? []
  return productRecords.map((record) => new Product(
    record.uuid as string,
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

/**
 * Open sort and filter page.
 * @returns {Promise<void>} - async
 */
async function openFilterPage(): Promise<void>{
  await router.push({ path: ROUTES.FILTER.path, query: { ...route.query }});
}

/**
 * Reset sorting and filter.
 * @returns {Promise<void>} - async
 */
async function resetFilter(): Promise<void>{
  await router.push({ path: route.path , query: { ...route.query, sort: null, category: null, brand: null } })
}

</script>
