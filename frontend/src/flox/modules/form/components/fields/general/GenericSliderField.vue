<template>
  <LabelWrapper :label="label">
    <q-slider
      v-model="fieldValue"
      class="row"
      style="margin: 10px; width: 60%"
      :min="min"
      :max="max"
      :step="step"
      label
      label-always
      switch-label-side
      :label-value="labelValue"
      :markers="smooth ? undefined : markers"
      :marker-labels="markers === true && markerLabels ? markerLabels : false"
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
    // Used to store or fetch data from/to the store
    stateKey?: FormStateKey | null;
    // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    initialValue?: number | null;
    // Field label
    label: string;
    // i18n key of suffix for label value (so count can be applied correctly)
    suffix?: string | null;
    // Min value for the slider range
    min?: number;
    // Max value for the slider range
    max?: number;
    // If true, markers will be automatically set, if a number that many markers will be set
    markers?: boolean | number;
    // Labels for markers, only works if markers is set to true
    markerLabels?:
      | { value: number; label: string }[]
      | ((val: number) => string)
      | { number: string }
      | null;
    // Whether to not set any tick increments
    smooth?: boolean;
    // Step size for slider changes
    step?: number;
    // Default value for field (must be larger than min)
    defaultValue?: number;
  }>(),
  {
    stateKey: null,
    initialValue: null,
    suffix: null,
    min: 0,
    max: 100,
    markers: false,
    markerLabels: null,
    smooth: false,
    step: 1,
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
