<template>
  <strong class="q-ma-lg">
    {{ $t('log_files.ftp_log_file') }}
  </strong>

</template>

<script setup lang="ts">

import {defineProps} from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  cli: {
    type: String,
    required: true
  }
})
</script>
