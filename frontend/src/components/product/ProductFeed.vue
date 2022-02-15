<template>
  <div class="col q-pa-md">
    <div v-if="searchFilter.length > 0" class="row">
      {{ $t('products.results_for') }} "<strong> {{ searchFilter[0] }} </strong>"
    </div>
    <div class="row q-mt-sm">
      <q-btn
        rounded
        :label="$t('products.filter_and_sort')"
        icon="sort"
        class="col"
        style="max-width: 250px;"
        @click="openFilterPage"
      >
        <q-badge
          v-if="filterCount > 0"
          floating
          color="red"
          rounded
          style="height: 18px; width: 18px; z-index: 10"
        >
          {{filterCount}}
        </q-badge>
      </q-btn>
      <q-btn
        rounded
        :label="$t('products.reset_filter')"
        class="col q-ml-md"
        style="max-width: 200px;"
        @click="resetFilter"
      />
    </div>
    <div class="col q-mt-md">
      <div
        v-for="product in sortedProducts"
        :key="`${product.uuid}-${searchFilter}`"
        class="row q-mt-md"
      >
        <ProductCard
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from 'components/product/ProductCard.vue';
import { fetchAllProducts } from 'src/helpers/api-helpers';
import { computed, inject, watchEffect } from 'vue';
import ROUTES from 'src/router/routes';
import { Context, Module } from 'vuex-smart-module';
import FeedState from 'src/store/feed/state';
import FeedGetters from 'src/store/feed/getters';
import FeedMutations from 'src/store/feed/mutations';
import { useFeedStore } from 'src/store/feed';
import FeedActions from 'src/store/feed/actions';
import { CATEGORY } from '../../../../shared/definitions/ENUM';
import { RouterService } from 'src/services/RouterService';

const $routerService: RouterService|undefined = inject('$routerService')

const feedStore: Context<Module<FeedState, FeedGetters, FeedMutations, FeedActions>> = useFeedStore();

const allProducts = fetchAllProducts()

const searchFilter = computed(() => {
  return $routerService?.getQueryParam('search') ?? [];
})

const categoryFilter = computed({
  get(): string[] {
    return $routerService?.getQueryParam('category') ?? [];
  },
  async set(val: string | string[]) {
    await $routerService?.pushToQuery({ category: val })
  }
})

const brandFilter = computed({
  get(): string[] {
    return $routerService?.getQueryParam('brand') ?? [];
  },
  async set(val: string | string[]) {
    await $routerService?.pushToQuery({ brand: val })
  }
})

const sortBy = computed({
  get(): string[] {
    return $routerService?.getQueryParam('sort') ?? ['relevance'];
  },
  async set(val: string | string[]){
    await $routerService?.pushToQuery({ sort: val })
  }
})

const filterCount = computed(() => {
  let count = 0
  if(sortBy.value[0] !== 'relevance' && sortBy.value.length > 0){
    count += 1
  }
  if(brandFilter.value.length > 0){
    count += 1
  }
  if(categoryFilter.value.length > 0){
    count += 1
  }
  return count
})

/**
 * Products filtered by search-term, brand and category.
 */
const filteredProducts = computed(() => {
  let products = allProducts.value
  if(searchFilter.value.length > 0){
    const filter = searchFilter.value[0].toLowerCase();
    products = products.filter((product) =>
      product.title && product.title.toLowerCase().includes(filter) ||
      product.description && product.description.toLowerCase().includes(filter) ||
      product.tags.some(tag => tag.toLowerCase().includes(filter))
    )
  }
  if(brandFilter.value.length > 0){
    products = products.filter((product) => product.brand && brandFilter.value.includes(product.brand))
  }
  if(categoryFilter.value.length > 0){
    products = products.filter((product) => product.category && categoryFilter.value.includes(product.category))
  }
  return products;
})

/**
 * Products filtered and sorted by relevance (as it comes from the backend),
 * time-left, value ascending or value descending
 */
const sortedProducts = computed(() => {
  let products = filteredProducts.value
  if(sortBy.value === 'time_left'){
    products = products.sort((a, b) => a.end && b.end ? a.end.getTime() - b.end.getTime() : 0)
  }
  else if(sortBy.value === 'value_asc'){
    products = products.sort((a, b) => a.value && b.value ? a.value - b.value : 0)
  }
  else if(sortBy.value === 'value_desc'){
    products = products.sort((a, b) => b.value && a.value ? b.value - a.value : 0)
  }
  return products
})

const categories = computed(() => new Set(
  allProducts.value
    .filter((product) => product.category !== null)
    .map((product) => product.category ?? CATEGORY.CARS)
  ))

const brands = computed(() => new Set(
  allProducts.value
    .filter((product) => product.brand !== null)
    .map((product) => product.brand ?? '')
))

watchEffect(() => feedStore.commit('setCategories', [...categories.value]))
watchEffect(() => feedStore.commit('setBrands', [...brands.value]))

/**
 * Open sort and filter page.
 * @returns {Promise<void>} - async
 */
async function openFilterPage(): Promise<void>{
  await $routerService?.routeTo(ROUTES.FILTER, undefined, true);
}

/**
 * Returns all elements of a set as an array of strings.
 * @param {Set<string | CATEGORY>} set - Set from where to extract the values
 * @return {string[]} - Array with set values as strings
 */
function getSetValues(set: Set<string | CATEGORY>): string[] {
  const values = []
  for (let val of Array.from(set)) {
    if (Object.keys(CATEGORY).includes(val)) {
      val = val.toLowerCase()
    }
    values.push(val)
  }
  return values
}

/**
 * Reset sorting and filter.
 * @returns {Promise<void>} - async
 */
async function resetFilter(): Promise<void>{
  await $routerService?.pushToQuery({ sort: [], category: [], brand: [] })
}
</script>
