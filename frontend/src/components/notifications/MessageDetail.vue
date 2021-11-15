<template>
  <q-card
    flat
    class="q-pa-md q-ma-md"
  >
    <strong>{{ props.title }}</strong>
    <p>{{ received }}</p>
    <p>{{ content }}</p>

    <!-- Link to Voucher -->
  </q-card>
</template>

<script setup lang="ts">
/**
 * This component displays an opened message.
 */
const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  received: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String, //todo: needs to be component
  }
})

</script>
