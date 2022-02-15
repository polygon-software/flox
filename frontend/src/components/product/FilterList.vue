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
                :selected="sortBy[0] === 'relevance' || sortBy.length === 0"
                :color="sortBy[0] === 'relevance' || sortBy.length === 0 ? 'primary' : 'gray'"
                @click="sortBy = 'relevance'"
              />
              <q-chip
                :label="$t('products.time_left')"
                :selected="sortBy[0] === 'time_left'"
                :color="sortBy[0] === 'time_left' ? 'primary' : 'gray'"
                @click="sortBy = 'time_left'"
              />
              <q-chip
                :label="$t('products.value_asc')"
                :selected="sortBy[0] === 'value_asc'"
                :color="sortBy[0] === 'value_asc' ? 'primary' : 'gray'"
                @click="sortBy = 'value_asc'"
              />
              <q-chip
                :label="$t('products.value_desc')"
                :selected="sortBy[0] === 'value_desc'"
                :color="sortBy[0] === 'value_desc' ? 'primary' : 'gray'"
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
              <q-chip
                :label="$t('products.all')"
                :selected="selectedCategoryFilters.length === 0"
                :color="selectedCategoryFilters.length === 0 ? 'primary' : 'gray'"
                @click="selectAllAttributes(categoryFilters)"
              />
              <q-chip
                v-for="category in categories"
                :key="category"
                :label="$t(`categories.${category.toLowerCase()}`)"
                :selected="selectedCategoryFilters.includes(category)"
                :color="selectedCategoryFilters.includes(category) ? 'primary' : 'gray'"
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
                :selected="selectedBrandFilters.length === 0"
                :color="selectedBrandFilters.length === 0 ? 'primary' : 'gray'"
                @click="selectAllAttributes(brandFilters)"
              />
              <q-chip
                v-for="brand in brands"
                :key="brand"
                :label="brand"
                :selected="selectedBrandFilters.includes(brand)"
                :color="selectedBrandFilters.includes(brand) ? 'primary' : 'gray'"
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
import {computed, ComputedRef, inject, Ref, ref} from 'vue';
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

const allFilters: Ref<Array<Record<string, boolean>>> = ref([])

const categories = computed(() => feedStore.getters.getCategories())
const categoryFilters: Ref<Record<string, boolean>> = ref(createFilterAttribute(categories, 'category'))
allFilters.value.push(categoryFilters.value)
const selectedCategoryFilters = computed(() => {
  const selected = []
  for (const [key, value] of Object.entries(categoryFilters.value)) {
    if (value) {
      selected.push(key)
    }
  }
  return selected
})

const brands = computed(() => feedStore.getters.getBrands())
const brandFilters: Ref<Record<string, boolean>> = ref(createFilterAttribute(brands, 'brand'))
allFilters.value.push(brandFilters.value)
const selectedBrandFilters = computed(() => {
  const selected = []
  for (const [key, value] of Object.entries(brandFilters.value)) {
    if (value) {
      selected.push(key)
    }
  }
  return selected
})

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
 * Create an object where the keys are product attributes like brand or category and the values are whether they are currently selected.
 * @param {ComputedRef<string[]>} attributes - Product attributes that can be filtered for.
 * @param {string} param - Query param that should be checked for already selected attributes
 * @return {Record<string, boolean>} - Object
 */
function createFilterAttribute(attributes: ComputedRef<string[]>, param: string): Record<string, boolean> {
  // Fill in all categories from the feed
  const filters: Record<string, boolean> = {}
  for (const attribute of attributes.value) {
    filters[attribute] = false
  }

  // Set all to selected, according to the query
  const queryParams = $routerService?.getQueryParam(param)
  if (queryParams) {
    for (const queryParam of queryParams) {
      filters[queryParam] = true
    }
  }
  return filters
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
  brandFilters.value[brand] = !brandFilters.value[brand]
  // Update query
  await $routerService?.pushToQuery({ brand: selectedBrandFilters.value })
}

/**
 * Sets all entires of a filter attribute to true.
 * @param {Record<string, boolean>} attributeFilter - The attribute where all entries should be set as selected
 * @return {void}
 */
function selectAllAttributes(attributeFilter: Record<string, boolean>): void {
  let key: keyof typeof attributeFilter;
  for (key in attributeFilter) {
    attributeFilter[key] = false
  }
}

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
  for (const filter of allFilters.value) {
    selectAllAttributes(filter)
  }
  await $routerService?.pushToQuery({ sort: [], category: [], brand: [] })
}
</script>
