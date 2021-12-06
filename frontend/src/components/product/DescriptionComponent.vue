<template>
  <div>
    {{ product.description }}
  </div>
</template>

<script setup lang="ts">

import {defineProps} from 'vue';

const props = defineProps({
  product: {
    required: true,
    type: Object,
  }
})


//TODO: Implement methods to fetch data from database

</script>
