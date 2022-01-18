<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ props.label}}</strong>
    <q-option-group
      v-model="selectedOption"
      class="col"
      :options="options"
      type="radio"
      inline
      @change="emitValue"
    />
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref,} from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  defaultValue: {
    type: Boolean,
    required: false,
    default: true,
  }
})
const emit = defineEmits(['change'])
const selectedOption = ref(props.defaultValue)

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  emit('change', selectedOption)
}
</script>
