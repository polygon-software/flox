<template>
  <q-select
    :model-value="model"
    v-bind="props"
    input-debounce="0"
    fill-input
    use-input
    hide-selected
    @filter="filterFn"
    @input-value="setModel"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
          <!-- TODO -->
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">

import {Ref, ref} from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  }
})


const filteredOptions =  ref(props.options)
const model: Ref<null|Record<string, string>> = ref(null)


// eslint-disable-next-line require-jsdoc
function filterFn (val: string, update: any, abort: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  update(() => {
    filteredOptions.value = props.options.filter((option) => {
      return (option as Record<string, string>).label.toLowerCase().indexOf(val.toLowerCase()) > -1
    })
  })
}

/**
 * On select, update model value
 * @param {Record<string, string>} val - new selection
 * @returns {void}
 */
function setModel(val: Record<string, string>) {
  model.value = val
}
</script>

<style scoped>

</style>
