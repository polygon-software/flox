<template>
  <LabelWrapper :label="label">
    <QOptionGroup
      v-model="fieldValue"
      :class="inline ? 'row justify-start' : 'column items-start'"
      :inline="inline"
      :options="options"
      :rules="rules"
      @update:model-value="saveValue"
    />
  </LabelWrapper>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { QOptionGroup } from 'quasar';

import { GenericOption } from '../../../data/types/GenericOption';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null; // If not given, this field emits instead of saving
    initialValue?: any; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    rules: ((val: any) => string | boolean)[];
    options: GenericOption[];
    label: string;
    inline?: boolean;
  }>(),
  {
    stateKey: null,
    initialValue: undefined,
    inline: false,
  }
);

const emit = defineEmits<{
  (e: 'change', selected: unknown): void;
}>();

const store = useFormStore();

// Get value (if preset)
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const fieldValue = ref(
  props.stateKey ? fetchByKey(props.stateKey) : props.initialValue
);

/**
 * If initialValue changes (and no stateKey is set), update field contents to new initialValue
 */
watch(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => props.initialValue,
  () => {
    if (!props.stateKey) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      fieldValue.value = props.initialValue;
    }
  },
  { deep: true }
);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    emit('change', fieldValue.value);
  }
}
</script>
