<template>
  <GenericOptionGroupField
    :initial-value="fieldValue.mediums"
    :label="$t('fields.authentication.send_invite')"
    :options="inviteOptions()"
    :rules="[IS_SELECTED]"
    @change="(val) => (Array.isArray(val) ? (fieldValue.mediums = val) : null)"
  />
  <PhoneNumberField
    v-if="phoneNumberNeeded"
    :country-codes="availablePhonenNumberOptions()"
    @change="
      (val) => (typeof val === 'string' ? (fieldValue.phoneNumber = val) : null)
    "
  />
</template>

<script lang="ts" setup>
import { computed, Ref, ref, watch } from 'vue';

import DELIVERY_MEDIUMS from '../../../../../enum/DELIVERY_MEDIUMS';
import SendInvite from '../../../data/types/SendInvite';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { IS_SELECTED } from '../../../data/RULES';
import {
  availablePhonenNumberOptions,
  inviteOptions,
} from '../../../helpers/generation-helpers';
import { fetchByKey } from '../../../helpers/form-helpers';

import GenericOptionGroupField from './GenericOptionGroupField.vue';
import PhoneNumberField from './PhoneNumberField.vue';

const props = withDefaults(
  defineProps<{
    stateKey: FormStateKey;
  }>(),
  {}
);

const store = useFormStore();

const fieldValue: Ref<SendInvite> = ref(
  (fetchByKey(props.stateKey) as SendInvite) ?? new SendInvite()
);

const phoneNumberNeeded = computed(() => {
  return (
    fieldValue.value.mediums &&
    fieldValue.value.mediums.includes(DELIVERY_MEDIUMS.SMS)
  );
});

/**
 * Saves the updated value
 * @returns void
 */
function saveValue(): void {
  if (fieldValue.value.isComplete()) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    store.setValue(props.stateKey, null);
  }
}

/**
 * Save values when fieldValue is uppdated
 */
watch(
  fieldValue,
  () => {
    saveValue();
  },
  { deep: true }
);
</script>
