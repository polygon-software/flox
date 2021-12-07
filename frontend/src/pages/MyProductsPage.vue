<template>
  <q-page class="flex">
    <!-- Top row: title + add button -->
    <div
      class="row full-width justify-between q-pa-md"
      style="height: 20px"
    >
      <!-- TODO styling, language-->
      <h6>Products</h6>
      <q-btn
        color="primary"
        text-color="black"
        label="Add new product"
        rounded
        @click="createProduct"
      />
    </div>
    <div class="column">
      TODO
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';
import ROUTES from 'src/router/routes';

const $routerService: RouterService|undefined = inject('$routerService')

/**
 * TODO
 */
function createProduct(){
  $routerService?.routeTo(ROUTES.ADD_PRODUCT)
}
</script>
