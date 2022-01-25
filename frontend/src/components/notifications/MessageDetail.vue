<template>
  <q-card
    flat
    class="q-ma-md"
  >
    <strong>{{ title }}</strong>
    <p>{{ formatDate(received) }}</p>
    <p>{{ content }}</p>

    <!-- Link to Voucher -->
  </q-card>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import {formatDate} from 'src/helpers/format-helpers';

/**
 * This component displays an opened message.
 */
defineProps({
  title: {
    required: true,
    type: String,
  },
  received: {
    required: true,
    type: Date,
  },
  content: {
    required: true,
    type: String,
  }
})

</script>
