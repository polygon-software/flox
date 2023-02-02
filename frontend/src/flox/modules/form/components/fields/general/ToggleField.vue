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
import { onBeforeMount, ref, Ref } from 'vue';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

const props = defineProps<{
  stateKey?: FormStateKey; // If not given, this field emits instead of saving
  label?: string;
  defaultValue?: boolean;
}>();

const emit = defineEmits<{
  (e: 'change', selected: boolean): void;
}>();

const store = useFormStore();

// Get value (if preset)
const initialValue = props.stateKey ? fetchByKey(props.stateKey) : null;
const fieldValue: Ref<boolean> = ref(
  initialValue ? (initialValue as boolean) : !!props.defaultValue
);

/**
 * Save or emit the updated value
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    emit('change', fieldValue.value);
  }
}

/**
 * If no value in store yet, write default
 * @returns void
 */
onBeforeMount(() => {
  if (
    (initialValue === null || initialValue === undefined) &&
    props.defaultValue !== undefined
  ) {
    saveValue();
  }
});
</script>
