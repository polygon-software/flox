<template>
  <div class="q-pa-sm">
    <div class="row justify-between q-ma-lg no-wrap">
      <q-btn icon="arrow_back" round color="primary" @click="onBack"/>
      {{ $t('products.filter_and_sort') }}
      <q-btn icon="refresh" round color="primary" @click="resetFilter"/>
    </div>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('products.sort_by') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="row">
            <q-radio v-model="sortBy" val="relevance" :label="$t('products.relevance')" />
            <q-radio v-model="sortBy" val="time_left" :label="$t('products.time_left')"/>
            <q-radio v-model="sortBy" val="value_asc" :label="$t('products.value_asc')"/>
            <q-radio v-model="sortBy" val="value_desc" :label="$t('products.value_desc')"/>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('products.category') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
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
              :label="$t(`products.category.${category}`)"
              :selected="categoryFilter === category"
              @click="categoryFilter = category"
            />
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ $t('products.brand') }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
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
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { defineProps, inject, ref } from 'vue';
import ROUTES from 'src/router/routes';
import { RouterService } from 'src/services/RouterService';

const $routerService: RouterService|undefined = inject('$routerService')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  brands: {
    type: Array,
    default: () => [],
  },
})

const sortBy = ref('relevance')
const categoryFilter = ref('all')
const brandFilter = ref('all')

/**
 * Go back to product feed
 * @returns {Promise<void>} - async
 */
async function onBack(): Promise<void>{
  await $routerService?.routeTo(ROUTES.MAIN)
}

/**
 * Open sort and filter page.
 * @returns {Promise<void>} - async
 */
async function resetFilter(): Promise<void>{
  // TODO: reset filter
  return new Promise((resolve => resolve()))
}
</script>
