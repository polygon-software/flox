<template>
  <LabelWrapper :label="label">
    <q-input
      v-model="fieldValue"
      v-bind="inputProps"
      outlined
      dense
      @change="saveValue"
    >
      <q-tooltip v-if="toolTip" :anchor="toolTip.anchor" :self="toolTip.self">
        {{ toolTip.text }}
      </q-tooltip>
    </q-input>
  </LabelWrapper>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, PropType, ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

import { FormStateKey, useFormStore } from '../../../store/form';
import { fetchByKey } from '../../../helpers/form-helpers';
import { Tooltip } from '../../../types/Tooltip';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  rules: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'text',
  },
  min: {
    type: String,
    required: false,
    default: '0',
  },
  suffix: {
    type: String,
    required: false,
    default: undefined,
  },
  mask: {
    type: String,
    required: false,
    default: undefined,
  },
  reverseFillMask: {
    type: Boolean,
    required: false,
    default: false,
  },
  hint: {
    type: String,
    required: false,
    default: undefined,
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
  style: {
    type: String,
    required: false,
    default: null,
  },
  lazyRules: {
    type: [Boolean, String],
    required: false,
    default: true,
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: undefined,
    required: false,
    default: null,
  },
  toolTip: {
    type: Object as PropType<Tooltip>,
    required: false,
    default: null,
  },
  defaultValue: {
    type: Object as PropType<unknown>,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['change']);

const store = useFormStore();
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;

// Actual field value
const fieldValue = ref(initialValue ?? props.defaultValue);

/**
 * Save or emit the updated value
 * @returns {void}
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
  if (
    (initialValue === null || initialValue === undefined) &&
    props.defaultValue !== null
  ) {
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
  const propsClone = cloneDeep(props);
  delete propsClone?.stateKey;
  delete propsClone?.label;

  return propsClone;
});
</script>
