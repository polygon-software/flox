<template>
  <div class="row q-mb-md">
    <!-- TODO i18n for name and others -->
    <q-select
      class="col-8"
      :model-value="selectedOption"
      label="Name"
      v-bind="props"
      :options="filteredOptions"
      :input-debounce="0"
      fill-input
      use-input
      hide-selected
      @filter="filterFn"
      @input-value="onOptionChange"
      @update:model-value="onDropdownSelect"
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

    <q-input
      :model-value="abbreviation"
      :maxlength="3"
      class="col q-ml-md"
      label="Abkürzung"
      :disable="!isNewBank"
      @change="onNewAbbreviation"
    />
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
const selectedOption: Ref<null|Record<string, unknown>> = ref(null)

const isNewBank = ref(false)
const abbreviation: Ref<string|null> = ref(null)


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
function onOptionChange(val: string) {
  // Check whether val is in options
  const hasMatchingOption = props.options.some((option) => {
    return (option as Record<string, Record<string, string>>).value.name.toLowerCase() === val.toLowerCase()
  })

  // If not, it must be new and user must manually enter abbreviation
  if(!hasMatchingOption){
    console.log('User entered custom!')
    isNewBank.value = true
    abbreviation.value = null
  }

  // selectedOption.value = val
  // const selectedBank = (props.options.find((option) => (option as Record<string, string>).label === val)) as Record<string, Record<string, string>> ?? null
  // selectedOption.value = selectedBank.value
  // console.log('selected', selectedOption.value)
}

// eslint-disable-next-line require-jsdoc
function onDropdownSelect(newSelection: Record<string, unknown>){
  console.log('Selected via dropdown:', newSelection)
  selectedOption.value = newSelection
  abbreviation.value = (selectedOption.value.value as Record<string, string>).abbreviation

}

// eslint-disable-next-line require-jsdoc
function onNewAbbreviation(val: string){
  abbreviation.value = val.toUpperCase()
}
// TODO emit

</script>

<style scoped>

</style>
