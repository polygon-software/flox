<template>
  <q-page class="row justify-center">
    <div class="col" style="max-width: 600px;">
      PARAMETERS PAGE for {{ parametersId }}
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  parametersId: {
    required: true,
    type: String
  }
})
</script>
