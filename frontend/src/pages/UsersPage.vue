<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title + add button -->
    <div
      class="row full-width justify-between q-pa-md"
      style="height: 20px"
    >
      <!-- TODO styling, language-->
      <h6 class="q-ma-none">{{ $t('admin.users') }}</h6>
      <q-btn
        color="primary"
        text-color="black"
        :label="$t('products.add_product')"
        rounded
        no-caps
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
import {inject, Ref, ref} from 'vue';
import ROUTES from 'src/router/routes';
import MyProductsTable from 'components/table/MyProductsTable.vue';
import {i18n} from 'boot/i18n';
import {USER_STATUS} from '../../../shared/definitions/ENUM';

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')

// Selected tab/status filter
const statusFilter: Ref<USER_STATUS|null> = ref(null)

// TODO possible user statuses?
const tabs = [
  {
    value: null,
    label: i18n.global.t('general.all'),
  },
  {
    value: USER_STATUS.APPLIED,
    label: i18n.global.t('user_status.applied'),
  },
  {
    value: USER_STATUS.ACTIVE,
    label: i18n.global.t('user_status.active'),
  },
  {
    value: USER_STATUS.DISABLED,
    label: i18n.global.t('user_status.disabled'),
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
