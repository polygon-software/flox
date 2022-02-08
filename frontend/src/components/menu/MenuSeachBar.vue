<template>
  <q-input
    v-model="search"
    outlined rounded
    class="q-ma-sm"
    style="width: 400px;"
    bg-color="white"
    :placeholder="$t('products.search')"
    @keypress.enter="onSearch"
  >
    <template #append>
      <q-icon
        v-if="search !== ''"
        name="close"
        class="cursor-pointer"
        @click="onClear"
      />
      <q-icon
        name="search"
        class="cursor-pointer"
        @click="onSearch"
      />
    </template>
  </q-input>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

const $routerService: RouterService|undefined = inject('$routerService')

const search = ref('')

/**
 * Go to product feed with search term.
 * @returns {Promise<void>} - async
 */
async function onSearch(): Promise<void> {
  await $routerService?.routeTo(ROUTES.MAIN, { search: search.value });
}

/**
 * Clear search term.
 * @returns {void} - void
 */
function onClear(): void {
  search.value = '';
}

</script>
