<template>
  <div class="q-pa-md">
    <div class="row justify-between no-wrap items-center">
      <q-btn icon="arrow_back" round color="primary" style="height: 15px; width: 15px;" @click="onBack"/>
      <h5>{{ $t('products.filter_and_sort') }}</h5>
      <q-btn icon="refresh" round color="primary" style="height: 15px; width: 15px;" @click="resetFilter"/>
    </div>
    <q-list>
      <!--- Sorting -->
      <q-item>
        <q-card class="q-pa-md full-width">
          <q-item-section>
            <q-item-label class="q-mb-md">{{ $t('products.sort_by') }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <div class="row">
              <q-chip
                :label="$t('products.relevance')"
                :selected="sortBy === 'relevance'"
                :color="sortBy === 'relevance' ? 'primary' : 'gray'"
                @click="sortBy = 'relevance'"
              />
              <q-chip
                :label="$t('products.time_left')"
                :selected="sortBy === 'time_left'"
                :color="sortBy === 'time_left' ? 'primary' : 'gray'"
                @click="sortBy = 'time_left'"
              />
              <q-chip
                :label="$t('products.value_asc')"
                :selected="sortBy === 'value_asc'"
                :color="sortBy === 'value_asc' ? 'primary' : 'gray'"
                @click="sortBy = 'value_asc'"
              />
              <q-chip
                :label="$t('products.value_desc')"
                :selected="sortBy === 'value_desc'"
                :color="sortBy === 'value_desc' ? 'primary' : 'gray'"
                @click="sortBy = 'value_desc'"
              />
            </div>
          </q-item-section>
        </q-card>
      </q-item>
      <!--- Category Filters -->
      <q-item>
        <q-card class="q-pa-md full-width">
          <!-- Title -->
          <q-item-section>
            <q-item-label class="q-mb-md">{{ $t('products.category') }}</q-item-label>
          </q-item-section>
          <!-- Chips -->
          <q-item-section>
            <div class="row">
              <!--TODO: Add a button to select all -->
              <q-chip
                v-for="category in categories"
                :key="category"
                :label="$t(`categories.${category.toLowerCase()}`)"
                :selected="selectedCategoryFilters.includes(category)"
                @click="toggleCategory(category)"
              />
            </div>
          </q-item-section>
        </q-card>
      </q-item>
      <!--- Brand Filters -->
      <q-item>
        <q-card class="q-pa-md full-width">
          <!-- Title -->
          <q-item-section>
            <q-item-label class="q-mb-md">{{ $t('products.brand') }}</q-item-label>
          </q-item-section>
          <!-- Chips -->
          <q-item-section>
            <div class="row">
              <q-chip
                :label="$t('products.all')"
                :selected="brandFilters === brands"
                @click="brandFilters = brands"
              />
              <q-chip
                v-for="brand in brands"
                :key="brand"
                :label="brand"
                :selected="brandFilters.includes(brand)"
                @click="toggleBrand(brand)"
              />
            </div>
          </q-item-section>
        </q-card>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, Ref, ref } from 'vue';
import ROUTES from 'src/router/routes';
import { Context, Module } from 'vuex-smart-module';
import FeedState from 'src/store/feed/state';
import FeedGetters from 'src/store/feed/getters';
import FeedMutations from 'src/store/feed/mutations';
import FeedActions from 'src/store/feed/actions';
import { useFeedStore } from 'src/store/feed';
import { RouterService } from 'src/services/RouterService';
import { CATEGORY } from '../../../../shared/definitions/ENUM';

const $routerService: RouterService|undefined = inject('$routerService')

const feedStore: Context<Module<FeedState, FeedGetters, FeedMutations, FeedActions>> = useFeedStore();

const categories = computed(() => categoriesToString(feedStore.getters.getCategories()))
const categoryFilters: Ref<Record<string, boolean>> = ref(createCategoryFilter())
const selectedCategoryFilters = computed(() => {
  const selected = []
  for (const [key, value] of Object.entries(categoryFilters)) {
    if (value) {
      selected.push(key)
    }
  }
  return selected
})

const brands = computed(() => feedStore.getters.getBrands())
const brandFilters: Ref<Record<string, boolean>> = ref(createBrandFilter())
const selectedBrandFilters = computed(() => {
  const selected = []
  for (const [key, value] of Object.entries(brandFilters)) {
    if (value) {
      selected.push(key)
    }
  }
  return selected
})

/**
 * Create an object where the keys are all categories and the values are whether they are currently selected.
 * @return {Record<string, boolean>} - Object
 */
function createCategoryFilter(): Record<string, boolean> {
  // Fill in all categories from the feed
  const filters: Record<string, boolean> = {}
  for (const category of categories.value) {
    filters[category] = false
  }

  // Set all to selected, according to the query
  const queryParams = $routerService?.getQueryParam('category')
  if (queryParams) {
    for (const category of queryParams) {
      filters[category] = true
    }
  }
  return filters
}

/**
 * Create an object where the keys are all categories and the values are whether they are currently selected.
 * @return {Record<string, boolean>} - Object
 */
function createBrandFilter(): Record<string, boolean> {
  // Fill in all brands from the feed
  const filters: Record<string, boolean> = {}
  for (const brand of brands.value) {
    filters[brand] = false
  }

  // Set all to selected, according to the query
  const queryParams = $routerService?.getQueryParam('brand')
  if (queryParams) {
    for (const brand of queryParams) {
      filters[brand] = true
    }
  }
  return filters
}


/**
 * Converts the ENUM values of categories to an array of strings.
 * @param {CATEGORY[]} categoriesENUM - Categories fetched via feedstore.
 * @return {string[]} - Categories as strings
 */
function categoriesToString(categoriesENUM: CATEGORY[]|string[]): string[] {
  const strings: string[] = []
  categoriesENUM.forEach(category => {
    strings.push(category.toLowerCase())
  })
  return strings
}

/**
 * Updates the object that contains all categories and pushes the changes to the url.
 * @param {string} category - Category to add or remove
 * @return {Promise<void>} - async
 */
async function toggleCategory(category: string): Promise<void> {
  // Toggle selection
  categoryFilters.value[category] = !categoryFilters.value[category]
  // Update query
  await $routerService?.pushToQuery({ category: selectedCategoryFilters.value })
}

/**
 * Updates the array that contains the selected brands and pushes the changes to the url.
 * @param {string} brand - Brand to add or remove
 * @return {Promise<void>} - async
 */
async function toggleBrand(brand: string): Promise<void> {
  // Toggle selection
  brandFilters.value[brand] = !categoryFilters.value[brand]
  // Update query
  await $routerService?.pushToQuery({ category: selectedBrandFilters.value })
  }

const sortBy = computed({
  get(): string[] {
    const sortParam = $routerService?.getQueryParam('sort')
    return sortParam ? sortParam : ['relevance']
  },
  async set(val: string | string[]){
    await $routerService?.pushToQuery({ sort: val })
  }
})

/**
 * Go back to product feed
 * @returns {Promise<void>} - async
 */
async function onBack(): Promise<void>{
  await $routerService?.routeTo(ROUTES.MAIN, undefined, true);
}

/**
 * Reset sorting and filter.
 * @returns {Promise<void>} - async
 */
async function resetFilter(): Promise<void>{
  await $routerService?.pushToQuery({ sort: ['relevance'], category: categories.value, brand: brands.value })
}
</script>
