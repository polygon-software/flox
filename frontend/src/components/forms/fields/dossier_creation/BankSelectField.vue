<template>
  <div class="row q-mb-md">
    <!-- Bank select dropdown (both existing and suggestions) -->
    <q-select
      class="col-8"
      :model-value="selectedOption"
      :label="$t('bank.name')"
      v-bind="props"
      :options="filteredOptions"
      :input-debounce="0"
      fill-input
      use-input
      hide-selected
      @filter="filterSuggestions"
      @input-value="onOptionChange"
      @update:model-value="onDropdownSelect"
    />

    <!-- Abbreviation field (pre-filled for existing, input for new -->
    <q-input
      :model-value="abbreviation"
      :maxlength="3"
      class="col q-ml-md"
      :label="$t('bank.abbreviation')"
      :disable="!isNewBank"
      :rules="[abbreviationRule]"
      @update:model-value="onNewAbbreviation"
    />
  </div>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';

const emit = defineEmits(['change'])

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
})

const filteredOptions =  ref(props.options)
const selectedOption: Ref<null|Record<string, unknown>> = ref(null)

const isNewBank = ref(false)
const abbreviation: Ref<string|null> = ref(null)

/**
 * Rule for  validation of custom abbreviations
 * @param {string} val - the abbreviation
 * @returns {boolean|string} - success (true), or an error message
 */
const abbreviationRule = (val: string) =>{
  // Only apply to custom banks
  if(!isNewBank.value){
    return true
  }

  // Check if abbreviation is of valid length
  if(!val || val.length !== 3){
    // Set to null and emit, since value is invalid
    (selectedOption.value?.value as Record<string, unknown>).abbreviation = null
    emitValue()

    return i18n.global.t('errors.abbreviation_length')
  }

  // Check if abbreviation is identical to an existing bank
  const existingBank = props.options.find((option => {
    return (option as Record<string, Record<string, string>>).value.abbreviation === val
  })) as Record<string, Record<string, string>>|null

  if(existingBank){
    // Set to null and emit, since value is invalid
    (selectedOption.value?.value as Record<string, unknown>).abbreviation = null
    emitValue()

    return i18n.global.t('errors.abbreviation_not_unique') + ' (' + existingBank.value.name + ')'
  }

  return true;
}

/**
 * Filter function for suggestions
 * @param {string} searchTerm - search term
 * @param {Function} update - update function
 * @returns {void}
 */
function filterSuggestions (searchTerm: string, update: (func: any) => any) {
  update(() => {
    filteredOptions.value = props.options.filter((option) => {
      return (option as Record<string, string>).label.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    })
  })
}

/**
 * When a new bank is chosen, verifies whether it's an existing or new (custom) option
 * @param {string} val - new text input
 * @returns {void}
 */
function onOptionChange(val: string) {
  // Check whether val is in options
  const hasMatchingOption = props.options.some((option) => {
    return (option as Record<string, Record<string, string>>).value.name.toLowerCase() === val.toLowerCase()
  })

  // Update disabled status of abbreviation field
  isNewBank.value = !hasMatchingOption

  // If bank is not in the options, user must manually enter abbreviation
  if(!hasMatchingOption){
    abbreviation.value = null

    // Update selection
    selectedOption.value = {
      label: val,
      value: {
        name:  val,
        abbreviation: null,
      }
    }
  }

  // Emit new value
  emitValue()
}

/**
 * When a preexisting option is selected via dropdown click
 * @param {Record<string, unknown>} newSelection - selected option, having 'label' and 'value'
 * @returns {void}
 */
function onDropdownSelect(newSelection: Record<string, unknown>){
  selectedOption.value = newSelection
  abbreviation.value = (selectedOption.value.value as Record<string, string>).abbreviation

  // Emit new value
  emitValue()
}

/**
 * Triggered when the user manually adds an abbreviation, add to selected option in uppercase
 * @param {string} val - abbreviation input
 * @returns {void}
 */
function onNewAbbreviation(val: string){
  abbreviation.value = val.toUpperCase()

  // Update current selection with abbreviation
  if(!selectedOption.value || !selectedOption.value.value){
    throw new Error('illegal combo')
  }

  (selectedOption.value.value as Record<string, string>).abbreviation = abbreviation.value

  // Emit new value
  emitValue()
}

/**
 * Emits the currently selected value, if it's valid
 * @returns {void}
 */
function emitValue(){
  const optionValue =  selectedOption.value?.value as Record<string, string>|null
  if(selectedOption.value && optionValue && optionValue.name && optionValue.abbreviation){
    emit('change', selectedOption.value.value)
  } else {
    // Invalid, emit null
    emit('change', null)
  }
}

</script>

<style scoped>

</style>
