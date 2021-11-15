<template>
  <q-card
    class="q-pa-sm q-mb-md"
    style="cursor: pointer"
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

  <!-- How to get prize -->

  <!-- Validation with QR code -->

</template>

<script setup lang="ts">

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
