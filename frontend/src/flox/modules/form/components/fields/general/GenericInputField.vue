<template>
  <LabelWrapper :label="label">
    <q-input
      v-model="fieldValue"
      v-bind="inputProps"
      outlined
      dense
      @change="saveValue"
    >
      <q-tooltip v-if="tooltip" :anchor="tooltip.anchor" :self="tooltip.self">
        {{ tooltip.text }}
      </q-tooltip>
    </q-input>
  </LabelWrapper>
</template>

<script setup lang="ts">
import { computed, defineProps, onBeforeMount, ref, watch } from 'vue';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';
import { Tooltip } from '../../../data/types/Tooltip';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null; // If not given, this field emits instead of saving
    // eslint-disable-next-line vue/no-unused-properties
    rules: ((val: any) => string | boolean)[];
    label: string;
    type?: string;
    // eslint-disable-next-line vue/no-unused-properties
    min?: string;
    // eslint-disable-next-line vue/no-unused-properties
    suffix?: string;
    // eslint-disable-next-line vue/no-unused-properties
    mask?: string;
    // eslint-disable-next-line vue/no-unused-properties
    reverseFillMask?: boolean;
    // eslint-disable-next-line vue/no-unused-properties
    hint?: string;
    // eslint-disable-next-line vue/no-unused-properties
    loading?: boolean;
    // eslint-disable-next-line vue/no-unused-properties
    disable?: boolean;
    // eslint-disable-next-line vue/no-unused-properties
    style?: string;
    // eslint-disable-next-line vue/no-unused-properties
    lazyRules?: boolean | string;
    initialValue?: string | number | null; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    tooltip?: Tooltip | null;
    defaultValue?: string | number | null;
  }>(),
  {
    stateKey: null,
    type: 'text',
    min: '0',
    suffix: undefined,
    mask: undefined,
    reverseFillMask: false,
    hint: undefined,
    loading: false,
    disable: false,
    style: undefined,
    lazyRules: true,
    initialValue: null,
    tooltip: null,
    defaultValue: null,
  }
);

const emit = defineEmits<{
  (e: 'change', value: string | number | null): void;
}>();

const store = useFormStore();
const initialValue = (
  props.stateKey ? fetchByKey(props.stateKey) : props.initialValue
) as string | number | null;

// Actual field value
const fieldValue = ref(initialValue ?? props.defaultValue);

/**
 * Save or emit the updated value
 */
function saveValue(): void {
  // If type is 'number', save/emit as actual parsed number
  if (props.type === 'number' && fieldValue.value) {
    const value = Number.parseFloat(fieldValue.value as string);
    if (props.stateKey) {
      store.setValue(props.stateKey, value);
    } else {
      emit('change', value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    emit('change', fieldValue.value);
  }
}

/**
 * If no value in store yet, write default
 */
onBeforeMount(() => {
  if (initialValue === null && props.defaultValue !== null) {
    saveValue();
  }
});

/**
 * If initialValue changes (and no stateKey is set), update field contents to new initialValue
 */
watch(
  () => props.initialValue,
  () => {
    if (!props.stateKey) {
      fieldValue.value = props.initialValue;
    }
  }
);

/**
 * Properties to pass on to input field (all except some)
 */
const inputProps = computed(() => {
  const keysToRemove = ['stateKey', 'label'];
  const result: Record<string, unknown> = {};
  Object.entries(props).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];
    if (!keysToRemove.includes(key)) {
      result[key] = value;
    }
  });

  return result;
});
</script>
