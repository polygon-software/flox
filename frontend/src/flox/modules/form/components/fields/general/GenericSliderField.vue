<template>
  <LabelWrapper :label="label">
    <q-slider
      v-model="fieldValue"
      class="row"
      style="margin: 10px; width: 60%"
      :min="min"
      :max="max"
      :step="1"
      label
      label-always
      switch-label-side
      :label-value="labelValue"
      :markers="smooth ? undefined : max - min"
      marker-labels
      @change="saveValue"
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null;
    initialValue?: number | null; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    label: string;
    suffix?: string | null; // i18n key of suffix for label value (so count can be applied correctly)
    min?: number;
    max?: number;
    smooth?: boolean; // Whether to not set any tick increments
    defaultValue?: number; // Default value for field (must be larger than min)
  }>(),
  {
    stateKey: null,
    initialValue: null,
    suffix: null,
    min: 0,
    max: 100,
    smooth: false,
    defaultValue: 0,
  }
);

const emit = defineEmits<{
  (e: 'change', selected: number): void;
}>();

const store = useFormStore();

// Fetch from store or use default value
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as number | null)
  : props.initialValue;

const validatedDefaultValue = props.defaultValue
  ? Math.min(Math.max(props.defaultValue, props.min), props.max)
  : props.min;

// InitialValue takes precedence over defaultValue
const fieldValue: Ref<number> = ref(initialValue ?? validatedDefaultValue);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    emit('change', fieldValue.value);
  }
}

const labelValue = computed(() => {
  if (props.suffix) {
    return `${fieldValue.value} ${i18n.global.t(
      `${props.suffix}, { count: ${fieldValue.value}`
    )}`;
  }
  return fieldValue.value;
});

/**
 * If no value in store yet, write default
 */
onBeforeMount(() => {
  if (initialValue === null) {
    saveValue();
  }
});
</script>
