<template>
  <div
    class="row justify-between"
    style="height: 11mm"
  >
    <q-item-label caption style="margin-top: 3.5mm">
      {{ label }}
    </q-item-label>
    <div
      class="row"
      style="width: 60%;"
    >
      <q-radio
        :model-value="value"
        :label="trueLabel"
        :val="true"
        color="black"
      />
      <q-radio
        :model-value="value"
        :label="falseLabel"
        :val="false"
        color="black"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  trueLabel: {
    type: String,
    required: true,
  },
  falseLabel: {
    type: Boolean,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
  }
})
</script>

<style scoped>
/* Single info field */
.info-field{
  height: 7mm;
  padding: 1mm;
  margin: 2mm 0 2mm 0
}
</style>
