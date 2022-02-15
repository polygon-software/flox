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
    <q-item-label :lines="1" style="width: 90%"> {{ content }}</q-item-label>
    <p style="font-size: small"> {{ formatDate(received) }}</p>
  </q-card>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import {formatDate} from 'src/helpers/format-helpers';

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
    type: Date,
  },
  isRead: {
    required: true,
    type: Boolean,
  },
  content: {
    required: true,
    type: String,
  },
})

</script>
