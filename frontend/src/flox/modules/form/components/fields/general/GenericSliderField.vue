<template>
  <LabelWrapper :label="props.label">
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
      :label-value="fieldValue + ' ' + $t(suffix, { count: fieldValue })"
      :markers="smooth ? null : max - min"
      marker-labels
      @change="saveValue"
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { onBeforeMount, PropType, Ref, ref } from 'vue';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: Number,
    required: false,
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  // i18n key of suffix for label value (so count can be applied correctly)
  suffix: {
    type: String,
    required: false,
    default: null,
  },
  min: {
    type: Number,
    required: false,
    default: 0,
  },
  max: {
    type: Number,
    required: false,
    default: 100,
  },
  // Whether to not set any tick increments
  smooth: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Default value for field (must be larger than min)
  defaultValue: {
    type: Number,
    required: false,
    default: 0,
  },
});

const emit = defineEmits(['change']);

const store = useFormStore();

// Fetch from store or use default value
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as number | null)
  : props.initialValue;

const _defaultValue = props.defaultValue
  ? Math.min(Math.max(props.defaultValue, props.min), props.max)
  : props.min;

// InitialValue takes precedence over defaultValue
const fieldValue: Ref<number> = ref(initialValue ?? _defaultValue);

/**
 * If no value in store yet, write default
 */
onBeforeMount(() => {
  if (
    (initialValue === null || initialValue === undefined) &&
    props.defaultValue !== null
  ) {
    saveValue();
  }
});

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue() {
  if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    emit('change', fieldValue.value);
  }
}
</script>
