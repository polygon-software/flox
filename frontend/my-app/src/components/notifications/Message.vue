<template>
  <q-card
    class="q-pa-sm q-mb-md"
    @click="toggleDetails"
    style="cursor: pointer"
  >
    <div class="flex items-center justify-between">
      <b> {{ title }} </b>
      <q-badge
        rounded
        color="red"
        v-show="!isRead"
      />
    </div>
    <p style="font-size: small"> {{ received }}</p>
  </q-card>

  <!-- How to get prize -->

  <!-- Validation with QR code -->

</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps( {
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
    type: String,
  },
  isRead: {
    required: true,
    ype: Boolean
  }
})

const showDetails = ref(false)


function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<style scoped>
</style>
