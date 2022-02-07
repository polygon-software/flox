<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ props.label}}</strong>
    <q-option-group
      v-model="selectedOption"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="emitValue"
    />
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref,} from 'vue';
import {useQuasar} from 'quasar';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {DOSSIER_WARNING} from '../../../../../definitions/ENUMS';

const $q = useQuasar()

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
    type: Object,
    required: false,
    default: null,
  },
  // Warnings in format [{value: true, text: 'something'}]
  warnings: {
    type: Array,
    required: false,
    default: null
  },
  initialValue: {
    type: Object,
    required: false,
    default: null
  }
})
const emit = defineEmits(['change', 'warning', 'no-warning'])
const selectedOption = ref(props.initialValue ?? props.defaultValue)


onMounted(() => {
  // Emit initial value, since it may already be a valid input
  emitValue()
})


/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  checkWarnings()

  emit('change', selectedOption.value)
}

/**
 * Upon changing value, ensures any needed warnings are shown
 * @returns {void}
 */
function checkWarnings(){
  if(props.warnings){
    const warnings: Record<string, unknown>[] = props.warnings

    // Find if there's a warning for the newly selected value
    const valueWarning = warnings.find((warning) => warning.value === selectedOption.value)

    // Trigger dialog & emit event
    if(valueWarning){
      const warningText = valueWarning.text

      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: warningText
        }
      })

      // Emit warning to mark as non-arrangeable
      emit('warning', valueWarning.type as DOSSIER_WARNING)
    } else {
      // Emit no-warning for all possible, since value is valid
      warnings.forEach((warning) => {
        emit('no-warning', warning.type )
      })
    }
  }
}

</script>
