<template>
  <div
    v-if="label"
    class="row justify-between"
    style="height: 11mm"
  >
    <q-item-label caption style="margin-top: 3.5mm">
      {{ label }}
    </q-item-label>
    <div class="info-field" style="width: 60%">
      {{ content }}
    </div>
  </div>
  <div
    v-else
    class="info-field"
  >
    {{ content }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: null
  },
  content: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
/* Single info field */
.info-field{
  height: 7mm;
  background: white;
  padding: 1mm;
  border-radius: 1mm;
  outline: 1px solid lightgray;
  margin: 2mm 0 2mm 0
}
</style>
