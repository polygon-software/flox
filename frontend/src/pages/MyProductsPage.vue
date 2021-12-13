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
import {i18n} from 'boot/i18n';

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')

// Selected tab/status filter
const statusFilter = ref('all')
const tabs = [
  {
    value: 'all',
    label: i18n.global.t('general.all'),
  },
  {
    value: PRODUCT_STATUS.DRAFT,
    label: i18n.global.t('product_status.draft'),
  },
  {
    value: PRODUCT_STATUS.ACTIVE,
    label: i18n.global.t('product_status.active'),
  },
  {
    value: PRODUCT_STATUS.ARCHIVED,
    label: i18n.global.t('product_status.archived'),
  },
]

/**
 * Routes to the product creation page
 * @async
 * @returns {void}
 */
async function createProduct(): Promise<void>{
  await $routerService?.routeTo(ROUTES.ADD_PRODUCT)
}
</script>
