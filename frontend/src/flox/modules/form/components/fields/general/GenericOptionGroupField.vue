<template>
  <LabelWrapper :label="label">
    <QOptionGroup
      v-model="fieldValue"
      :class="inline ? 'row justify-start' : 'column items-start'"
      :options="options"
      :rules="rules"
      :inline="inline"
      @update:model-value="saveValue"
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { QOptionGroup } from 'quasar';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';
import { Option } from 'src/data/types/Option';

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
    type: Object as PropType<Option>,
    required: false,
    default: null,
  },
  rules: {
    type: Array,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  inline: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(['change']);

const store = useFormStore();

// Get value (if preset)
const fieldValue = ref(
  props.stateKey ? fetchByKey(props.stateKey) : props.initialValue
);

/**
 * If initialValue changes (and no stateKey is set), update field contents to new initialValue
 */
watch(
  () => props.initialValue,
  () => {
    if (!props.stateKey) {
      fieldValue.value = props.initialValue;
    }
  },
  { deep: true }
);

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
