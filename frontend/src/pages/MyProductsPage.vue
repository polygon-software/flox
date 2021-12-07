<template>
  <q-page class="flex">
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
    <div class="column">
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

      <MyProductsTable/>


    </div>

  </q-page>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {inject, ref} from 'vue';
import ROUTES from 'src/router/routes';
import MyProductsTable from "components/table/MyProductsTable.vue";

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')

/**
 * TODO
 */
function createProduct(){
  $routerService?.routeTo(ROUTES.ADD_PRODUCT)
}
</script>
