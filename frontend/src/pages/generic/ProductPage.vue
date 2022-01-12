<template>
  <q-page class="flex flex-center">
    <div class="column">
      <div class="row q-pa-md">
        <ProductCardDetail :product="product"/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import ProductCardDetail from 'components/dialogs/ProductCardDetailDialog.vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  product: {
    required: true,
    type: Object,
  }
})

</script>
