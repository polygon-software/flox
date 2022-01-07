<template>
  <div
    v-if="label"
    class="row justify-between"
    style="height: 11mm"
  >
    <q-item-label caption style="margin-top: 3.5mm">
      {{ label }}
    </q-item-label>
    <div
      :class="label ? 'info-field text-right' : 'info-field'"
      style="width: 60%;"
    >
      <strong v-if="bold">
        {{ content }}
      </strong>
      <p v-else>
        {{ content }}
      </p>    </div>
  </div>
  <div
    v-else
    :class="label ? 'info-field text-right' : 'info-field'"
  >
    <strong v-if="bold">
      {{ content }}
    </strong>
    <p v-else>
      {{ content }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * A single text info field within a dossier's output document
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  bold: {
    type: Boolean,
    required: false,
    default: false,
  }
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
