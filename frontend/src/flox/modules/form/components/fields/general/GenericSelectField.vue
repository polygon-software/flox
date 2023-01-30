<template>
  <LabelWrapper :label="label">
    <QSelect
      v-model="selectedOption"
      v-bind="selectProps"
      dense
      outlined
      style="min-width: 200px"
      :label="!fieldValue ? $t('authentication.please_select') : undefined"
      @update:model-value="saveValue"
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, PropType, Ref, ref, watch } from 'vue';
import { QSelect } from 'quasar';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';
import { cloneDeep, isEqual } from 'lodash-es';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  rules: {
    type: undefined,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  disable: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: undefined,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['change']);

const store = useFormStore();
const selectedOption: Ref<{ label: string; value: unknown } | null> = ref(null);

// Get value (if preset)
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;
const fieldValue = ref(initialValue);

onBeforeMount(() => {
  // Ensures that selected options are correctly fetched from the store
  matchValue();
});

// Prefill, if initial data given or options have changed
watch(
  [() => props.initialValue, () => props.options],
  () => {
    fieldValue.value = props.initialValue;
    matchValue();
  },
  { deep: true }
);

/**
 * If there is a value saved in the store, this ensures
 * that the correct value is assigned to fieldvalue
 * @returns {void}
 */
function matchValue() {
  if (fieldValue.value) {
    // Find option that matches selection
    selectedOption.value =
      (props.options as { label: string; value: unknown }[]).find(
        (option: { label: string; value: unknown } | unknown) => {
          // For values that are objects, check full equality with selection OR matching UUID
          if (
            typeof option === 'object' &&
            option.label !== undefined &&
            option.value !== undefined
          ) {
            // If option.value is an object, UUID can possibly be compared
            const matchingUuid =
              !!fieldValue.value?.uuid &&
              typeof option.value === 'object' &&
              (option as { label: string; value: Record<string, unknown> })
                .value?.uuid === fieldValue.value?.uuid;
            return isEqual(option.value, fieldValue.value) || matchingUuid;
          }

          // If option is not label/value pair, but only one primitive, compare directly
          return option === fieldValue.value;
        }
      ) ?? null;
  }
}

/**
 * Properties to pass on to select field (all except some)
 */
const selectProps = computed(() => {
  return cloneDeep({
    options: props.options,
    rules: props.rules,
    loading: props.loading,
    disable: props.disable,
  });
});

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue() {
  // Store value
  if (typeof selectedOption.value === 'object') {
    fieldValue.value = selectedOption.value?.value ?? null;
  } else {
    fieldValue.value = selectedOption.value ?? null;
  }

  if (fieldValue.value) {
    if (props.stateKey) {
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      emit('change', fieldValue.value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  } else {
    emit('change', null);
  }
}
</script>
