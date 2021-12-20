<template>
  <q-card
    class="q-pa-sm q-mb-md"
    style="cursor: pointer"
    bordered
  >
    <div class="flex items-center justify-between">
      <strong> {{ title }} </strong>
      <q-badge
        v-show="!props.isRead"
        rounded
        color="red"
      />
    </div>
    <p style="font-size: small"> {{ received }}</p>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
/**
 * This component displays a message item in the message-inbox.
 */

const props = defineProps( {
  title: {
    required: true,
    type: String,
  },
  received: {
    required: true,
    type: String,
  },
  isRead: {
    required: true,
    type: Boolean
  }
})

</script>

<style scoped>
</style>
