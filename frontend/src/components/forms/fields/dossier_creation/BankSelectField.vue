<template>
  <div class="column q-mb-md">
    <q-select
      :model-value="selectedOption"
      v-bind="props"
      :options="filteredOptions"
      :input-debounce="0"
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


    <q-item-label caption class="text-primary">
      oder
    </q-item-label>

    <div class="row">
      <q-input
        v-model="newName"
        class="col-8"
        label="Name"
      />
      <q-input
        :model-value="newAbbreviation"
        :maxlength="3"
        class="col q-ml-md"
        label="Abkürzung"
        @change="onNewAbbreviation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import {Ref, ref} from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  suggestions: {
    type: Array,
    required: true
  }
})


const filteredOptions =  ref(props.options)
const selectedOption: Ref<null|Record<string, string>> = ref(null)


const newName: Ref<string|null> = ref(null)
const newAbbreviation: Ref<string|null> = ref(null)

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
 * @param {string} val - new text input
 * @returns {void}
 */
function setModel(val: string) {
  selectedOption.value = val
  // const selectedBank = (props.options.find((option) => (option as Record<string, string>).label === val)) as Record<string, Record<string, string>> ?? null
  // selectedOption.value = selectedBank.value
  // console.log('selected', selectedOption.value)
}

// eslint-disable-next-line require-jsdoc
function onNewAbbreviation(val: string){
  newAbbreviation.value = val.toUpperCase()
}
// TODO emit

</script>

<style scoped>

</style>
