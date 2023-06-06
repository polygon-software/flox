<template>
  <LabelWrapper :label="label">
    <QSelect
      v-model="selectedOption"
      v-bind="selectProps"
      dense
      outlined
      style="min-width: 200px"
      :label="
        fieldValue === null ? $t('fields.select.please_select') : undefined
      "
      @update:model-value="saveValue"
    />
  </LabelWrapper>
  <!-- Spacer to keep padding consistent to fields that have rules (where quasar auto-adds padding) -->
  <div v-if="rules.length < 1" style="height: 20px" />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, Ref, ref, watch } from 'vue';
import { QSelect } from 'quasar';
import { cloneDeep, isEqual } from 'lodash-es';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';
import { GenericOption } from '../../../data/types/GenericOption';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null;
    initialValue?: any; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    label: string;
    options: GenericOption[];
    rules: ((val: any) => string | boolean)[];
    loading?: boolean;
    disable?: boolean;
  }>(),
  {
    stateKey: null,
    initialValue: null,
    loading: false,
    disable: false,
  }
);

const emit = defineEmits<{
  (e: 'change', selected: any): void;
}>();

const store = useFormStore();
const selectedOption: Ref<GenericOption | null> = ref(null);

// Get value (if preset)
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const fieldValue: Ref<any> = ref(initialValue);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  // Store value
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  fieldValue.value = selectedOption.value?.value ?? null;

  if (fieldValue.value !== null) {
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

/**
 * If there is a value saved in the store, this ensures
 * that the correct value is assigned to fieldvalue
 * @returns void
 */
function matchValue(): void {
  if (fieldValue.value !== null) {
    // Find option that matches selection
    selectedOption.value =
      props.options.find((option) => {
        // Check full equality with selection OR matching UUID
        if (option.value !== undefined) {
          // If option.value is an object, UUID can possibly be compared, since Graphql does
          // not always fetch the same queries. Therefore, comparing the uuid is considered
          // sufficient
          const matchingUuid =
            (fieldValue.value as Record<string, unknown>).uuid &&
            (option as { label: string; value: Record<string, any> }).value
              ?.uuid === (fieldValue.value as Record<string, any>).uuid;
          return isEqual(option.value, fieldValue.value) || matchingUuid;
        }
        return null;
      }) ?? null;
  } else {
    selectedOption.value = null;
  }
}

onBeforeMount(() => {
  // Ensures that selected options are correctly fetched from the store
  matchValue();
});

// Prefill, if initial data given or options have changed
watch(
  [(): any => props.initialValue, (): GenericOption[] => props.options ?? []],
  () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    fieldValue.value = props.initialValue;
    matchValue();
  },
  { deep: true }
);

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
</script>
