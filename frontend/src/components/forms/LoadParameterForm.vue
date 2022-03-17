<template>
  <div>
    <div style="display:flex; flex-direction: row; align-items: center">
      <p>{{ $t('edit_parameters.parameters_from_another') }}</p>
      <q-select v-model="selection" outlined :options="options" style="margin-left: 25px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const selection = ref(null)

// TODO: get real data from database
const options = [
  'MR1','MR2', 'MR3'
]

/**
 * Return the selected values of this form
 * @returns {object} - object which contains all values
 */
function getData(): Record<string, unknown>{
  return {selection: selection.value}
}

</script>
