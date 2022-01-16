<template>
  <div class="row q-mb-md">
    <h7 class="col q-py-sm">{{ $t('form_for_clients.type') }}</h7>
    <q-option-group
      class="col"
      v-model="selectedOption"
      :options="options"
      type="radio"
      inline
    />
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {ref, } from 'vue';

const emit = defineEmits(['change'])

const options = [
  {label: i18n.global.t('form_for_clients.direct'), value: true},
  {label: i18n.global.t('form_for_clients.indirect'), value: false},
]

const selectedOption = ref(options[0].value)

/**
 * Emits the updated value, if it is valid
 *       label: i18n.global.t('form_for_clients.owner_occupied'),
 * @returns {void}
 */
function emitValue(){
  emit('change', selectedOption)
}
</script>
