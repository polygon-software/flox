<template>
  <div class="q-pa-md">
    <div class="row justify-between no-wrap">
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
              :label="$t(`products.categories.${category}`)"
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
import { computed } from 'vue';
import ROUTES from 'src/router/routes';
import { useRoute, useRouter } from 'vue-router';
import { Context, Module } from 'vuex-smart-module';
import FeedState from 'src/store/feed/state';
import FeedGetters from 'src/store/feed/getters';
import FeedMutations from 'src/store/feed/mutations';
import FeedActions from 'src/store/feed/actions';
import { useFeedStore } from 'src/store/feed';

const feedStore: Context<Module<FeedState, FeedGetters, FeedMutations, FeedActions>> = useFeedStore();

const router = useRouter()
const route = useRoute()

const categories = computed(() => feedStore.getters.getCategories())
const brands = computed(() => feedStore.getters.getBrands())

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

/**
 * Go back to product feed
 * @returns {Promise<void>} - async
 */
async function onBack(): Promise<void>{
  await router.push({ path: ROUTES.MAIN.path, query: { ...route.query  } })
}

/**
 * Reset sorting and filter.
 * @returns {Promise<void>} - async
 */
async function resetFilter(): Promise<void>{
  await router.push({ path: route.path , query: { ...route.query, sort: 'relevance', category: 'all', brand: 'all' } })
}
</script>
