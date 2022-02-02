<template>
  <div class="col q-pa-md">
    <div v-if="searchFilter !== ''" class="row">
      {{ $t('products.results_for') }} "<strong> {{ searchFilter }} </strong>"
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
import { subscribeToQuery } from 'src/helpers/data-helpers';
import { computed, Ref, watchEffect } from 'vue';
import { ALL_PRODUCTS } from 'src/data/queries/PRODUCT';
import { Product } from 'src/data/types/Product';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import { useRoute, useRouter } from 'vue-router';
import { Context, Module } from 'vuex-smart-module';
import FeedState from 'src/store/feed/state';
import FeedGetters from 'src/store/feed/getters';
import FeedMutations from 'src/store/feed/mutations';
import { useFeedStore } from 'src/store/feed';
import FeedActions from 'src/store/feed/actions';

const feedStore: Context<Module<FeedState, FeedGetters, FeedMutations, FeedActions>> = useFeedStore();

const router = useRouter()
const route = useRoute()

const allProducts = fetchAllProducts()

const searchFilter = computed(() => {
  return route.query.search as string ?? '';
})

const categoryFilter = computed({
  get(): string{
    return route.query.category as string ?? 'all';
  },
  async set(val: string) {
    await router.push({ path: route.path, query: { ...route.query, category: val } })
  }
})

const brandFilter = computed({
  get(): string{
    return route.query.brand as string ?? 'all';
  },
  async set(val: string) {
    await router.push({ path: route.path, query: { ...route.query, brand: val } })
  }
})

const sortBy = computed({
  get(): string{
    return route.query.sort as string ?? 'relevance';
  },
  async set(val: string){
    await router.push({ path: route.path , query: { ...route.query, sort: val } })
  }
})

const filterCount = computed(() => {
  let count = 0
  if(sortBy.value !== 'relevance'){
    count += 1
  }
  if(brandFilter.value !== 'all'){
    count += 1
  }
  if(categoryFilter.value !== 'all'){
    count += 1
  }
  return count
})

const filteredProducts = computed(() => {
  let products = allProducts.value
  if(searchFilter.value !== ''){
    const filter = searchFilter.value.toLowerCase();
    products = products.filter((product) =>
      product.title.toLowerCase().includes(filter) ||
      product.description.toLowerCase().includes(filter) ||
      product.tags.some(tag => tag.toLowerCase().includes(filter))
    )
  }
  if(brandFilter.value !== 'all'){
    products = products.filter((product) => product.brand === brandFilter.value)
  }
  if(categoryFilter.value !== 'all'){
    products = products.filter((product) => product.category === categoryFilter.value)
  }
  return products;
})

const sortedProducts = computed(() => {
  let products = filteredProducts.value
  if(sortBy.value === 'time_left'){
    products = products.sort((a, b) => a.end.getTime() - b.end.getTime())
  }
  else if(sortBy.value === 'value_asc'){
    products = products.sort((a, b) => a.value - b.value)
  }
  else if(sortBy.value === 'value_desc'){
    products = products.sort((a, b) => b.value - a.value)
  }
  return products
})

const categories = computed(() => new Set(realProducts.value.map((product) => product.category)))
const brands = computed(() => new Set(realProducts.value.map((product) => product.brand)))

watchEffect(() => feedStore.commit('setCategories', [...categories.value]))
watchEffect(() => feedStore.commit('setBrands', [...brands.value]))

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
  await router.push({ path: route.path , query: { ...route.query, sort: 'relevance', category: 'all', brand: 'all' } })
}
</script>
