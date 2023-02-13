<template>
  <GenericInputField
    :initial-value="fieldValue.email"
    :label="$t('authentication.email')"
    dense
    outlined
    type="text"
    :rules="[IS_EMAIL]"
    @change="
      (val) => (typeof val === 'string' ? (fieldValue.email = val) : null)
    "
  />
  <GenericInputField
    :initial-value="fieldValue.emailRepeat"
    :label="$t('authentication.email_repeat')"
    dense
    outlined
    type="text"
    :rules="[
      (val: string) => val === fieldValue.email || $t('errors.non_matching_email'),
    ]"
    @change="
      (val) => (typeof val === 'string' ? (fieldValue.emailRepeat = val) : null)
    "
  />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, Ref } from 'vue';

import { IS_EMAIL } from 'src/flox/modules/form/data/RULES';

import EmailRepeat from '../../../data/types/EmailRepeat';
import { fetchByKey } from '../../../helpers/form-helpers';
import { FormStateKey, useFormStore } from '../../../stores/form';

import GenericInputField from './GenericInputField.vue';

/**
 * This component contains field to enter a new email, as well as another field to repeat the email. Both entries need to match.
 */

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null;
    initialValue?: string | null; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
  }>(),
  {
    stateKey: null,
    initialValue: null,
  }
);
const emit = defineEmits<{
  (e: 'change', value: string | null): void;
}>();

const store = useFormStore();
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as string | null)
  : props.initialValue;
const fieldValue: Ref<EmailRepeat> = ref(
  initialValue ? new EmailRepeat(initialValue) : new EmailRepeat()
);

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    if (fieldValue.value.isComplete()) {
      store.setValue(props.stateKey, fieldValue.value.email);
    } else {
      store.setValue(props.stateKey, null);
    }
  } else if (fieldValue.value.isComplete() && fieldValue.value.email) {
    emit('change', fieldValue.value.email);
  } else {
    emit('change', null);
  }
}

/**
 * Save value on change
 */
watch(
  fieldValue,
  () => {
    saveValue();
  },
  { deep: true }
);
</script>
