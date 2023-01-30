<template>
  <div class="row">
    <q-toggle
        v-model="fieldValue"
        :label="label"
        @update:model-value="saveValue"
    />
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, PropType, ref, Ref} from 'vue';
import {FormStateKey, useFormStore} from 'stores/form';
import {fetchByKey} from 'src/helpers/form/form-helpers';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null
  },
  label: {
    type: String,
    required: false,
    default: null
  },
  defaultValue: {
    type: Boolean,
    required: false,
    default: null
  }
})

const store = useFormStore()

// Get value (if preset)
const initialValue = fetchByKey(props.stateKey)
const fieldValue: Ref<boolean> = ref(initialValue ? initialValue as boolean : props.defaultValue)

/**
 * If no value in store yet, write default
 */
onBeforeMount(() => {
  if((initialValue === null || initialValue === undefined) && props.defaultValue !== null){
    saveValue()
  }
})

/**
 * Save the updated value
 * @returns {void}
 */
function saveValue() {
    store.setValue(props.stateKey, fieldValue.value);
}
</script>

