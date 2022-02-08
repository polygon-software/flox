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
              <q-chip
                :label="$t('products.all')"
                :selected="categoryFilter === 'all'"
                @click="categoryFilter = 'all'"
              />
              <q-chip
                v-for="category in categories"
                :key="category"
                :label="$t(`categories.${category.toLowerCase()}`)"
                :selected="categoryFilter === category"
                @click="categoryFilter = category"
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
                :selected="brandFilter === 'all'"
                @click="brandFilter = 'all'"
              />
              <q-chip
                v-for="brand in brands"
                :key="brand"
                :label="brand"
                :selected="brandFilter === brand"
                @click="brandFilter = brand"
              />
            </div>
          </q-item-section>
        </q-card>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import ROUTES from 'src/router/routes';
import { Context, Module } from 'vuex-smart-module';
import FeedState from 'src/store/feed/state';
import FeedGetters from 'src/store/feed/getters';
import FeedMutations from 'src/store/feed/mutations';
import FeedActions from 'src/store/feed/actions';
import { useFeedStore } from 'src/store/feed';
import { RouterService } from 'src/services/RouterService';

const $routerService: RouterService|undefined = inject('$routerService')

const feedStore: Context<Module<FeedState, FeedGetters, FeedMutations, FeedActions>> = useFeedStore();

const categories = computed(() => feedStore.getters.getCategories())
const brands = computed(() => feedStore.getters.getBrands())

const categoryFilter = computed({
  get(): string{
    return $routerService?.getQueryParam('category') ?? 'all';
  },
  async set(val: string) {
    await $routerService?.pushToQuery({ category: val })
  }
})

const brandFilter = computed({
  get(): string{
    return $routerService?.getQueryParam('brand') ?? 'all';
  },
  async set(val: string) {
    await $routerService?.pushToQuery({ brand: val })
  }
})

const sortBy = computed({
  get(): string{
    return $routerService?.getQueryParam('sort') ?? 'relevance';
  },
  async set(val: string){
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
  await $routerService?.pushToQuery({ sort: 'relevance', category: 'all', brand: 'all' })
}
</script>
