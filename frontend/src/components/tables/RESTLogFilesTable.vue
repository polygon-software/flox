<template>
  <p class="q-ma-lg">
    {{ $t('log_files.rest_log_file') }}
  </p>

</template>

<script setup lang="ts">

import {defineProps} from 'vue';

const props = defineProps({
  cli: {
    type: String,
    required: true
  }
})
</script>
