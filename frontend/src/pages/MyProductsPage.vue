<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title + add button -->
    <div
      class="row full-width justify-between q-pa-md"
      style="height: 20px"
    >
      <!-- TODO styling, language-->
      <h6 class="q-ma-none">{{ $t('products.products') }}</h6>
      <q-btn
        color="primary"
        text-color="black"
        label="Add new product"
        rounded
        @click="createProduct"
      />
    </div>
    <!-- Body: Table with tabs etc. -->
    <div
      class="column full-height items-start q-pa-md full-width"
    >
      <!-- TODO tabs -->

      <!-- Search bar -->
      <q-input
        v-model="search"
        dense
        rounded
        outlined
        type="search"
        class="q-mb-md"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Tab header -->
      <div style="margin-bottom: 16px">
        <q-tabs
          v-model="statusFilter"
          dense
          class="q-mt-xs text-grey"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.value"
            :name="tab.value"
            :label="tab.label"
            no-caps
          >
          </q-tab>
        </q-tabs>
        <q-separator />
      </div>

      <!-- Table view of products -->
      <MyProductsTable
        :search="search"
        :status-filter="statusFilter"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {inject, ref} from 'vue';
import ROUTES from 'src/router/routes';
import MyProductsTable from 'components/table/MyProductsTable.vue';
import {PRODUCT_STATUS} from '../../../shared/definitions/ENUM';

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')

// Selected tab/status filter
const statusFilter = ref('all')
const tabs = [
  {
    value: 'all',
    label: 'All', // TODO
  },
  {
    value: PRODUCT_STATUS.ACTIVE,
    label: 'Active', // TODO
  },
  {
    value: PRODUCT_STATUS.DRAFT,
    label: 'Draft', // TODO
  },
  {
    value: PRODUCT_STATUS.ARCHIVED,
    label: 'Archived', // TODO
  },
]

/**
 * Routes to the product creation page
 */
function createProduct(){
  $routerService?.routeTo(ROUTES.ADD_PRODUCT)
}
</script>
