<template>
  <q-card
    class="q-pa-sm q-mb-md"
    style="cursor: pointer"
    bordered
  >
    <div class="flex items-center justify-between">
      <b> {{ title }} </b>
      <q-badge
        rounded
        color="red"
        v-show="!props.isRead"
      />
    </div>
    <p style="font-size: small"> {{ received }}</p>
  </q-card>
</template>

<script setup lang="ts">
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
