<template>
  <div class="q-mb-md">
    <q-option-group
      v-model="selectedOption"
      :options="options"
      type="radio"
      align="left"
    />
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {ref, } from 'vue';

const emit = defineEmits(['change'])

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const selectedOption = ref(options[0].value)

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  emit('change', selectedOption)
}
</script>
