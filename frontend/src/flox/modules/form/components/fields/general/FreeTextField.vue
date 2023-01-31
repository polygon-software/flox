<template>
  <LabelWrapper :label="label">
    <q-input
      v-model="fieldValue"
      name="freeText"
      dense
      outlined
      type="textarea"
      @change="saveValue"
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

import { i18n } from 'boot/i18n';
import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null; // If not given, this field emits instead of saving
    initialValue?: string | null;
    label?: string | null;
  }>(),
  {
    stateKey: null,
    initialValue: null,
    label: i18n.global.t('authentication.free_text'),
  }
);

const emit = defineEmits<{
  (e: 'change', value: string | null): void;
}>();

const store = useFormStore();
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;
const fieldValue: Ref<string | null> = ref((initialValue as string) ?? null);

/**
 * Save the updated value
 * @returns {void}
 */
function saveValue(): void {
  if (props.stateKey) {
    if (fieldValue.value) {
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      store.setValue(props.stateKey, null);
    }
  } else {
    emit('change', fieldValue.value);
  }
}
</script>
