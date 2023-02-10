<template>
  <!-- Set or generate password -->
  <GenericOptionGroupField
    :options="setPasswordOptions"
    :rules="[(val) => IS_NOT_NULL(val) || $t('errors.no_selection')]"
    :label="$t('authentication.password')"
    @change="
      (val) =>
        typeof val === 'boolean' ? (fieldValue.setPassword = val) : null
    "
  />

  <!-- Password set by admin -->
  <PasswordField
    v-if="fieldValue?.setPassword"
    :state-key="stateKey"
    @change="
      (val) => (typeof val === 'string' ? (fieldValue.password = val) : null)
    "
  />

  <!-- Send invite -->
  <GenericOptionGroupField
    :options="inviteOptions"
    :rules="[(val) => IS_NOT_NULL(val) || $t('errors.no_selection')]"
    :label="`${$t('fields.create_user.send_invite')}?`"
    @change="
      (val) => (typeof val === 'boolean' ? (fieldValue.sendInvite = val) : null)
    "
  />
</template>

<script setup lang="ts">
import { ref, watch, defineProps, Ref } from 'vue';

import { i18n } from 'boot/i18n';
import PasswordField from 'src/flox/modules/form/components/fields/general/PasswordField.vue';

import { FormStateKey, useFormStore } from '../../../../form/stores/form';
import { fetchByKey } from '../../../../form/helpers/form-helpers';
import CognitoOptions from '../../../../form/data/types/CognitoOptions';
import GenericOptionGroupField from '../../../../form/components/fields/general/GenericOptionGroupField.vue';
import { IS_NOT_NULL } from '../../../../form/data/RULES';

const props = withDefaults(
  defineProps<{
    stateKey: FormStateKey;
  }>(),
  {}
);
const emit = defineEmits<{
  (e: 'change', value: CognitoOptions | null): void;
}>();

const store = useFormStore();
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as CognitoOptions | null)
  : null;
const fieldValue: Ref<CognitoOptions | null> = ref(initialValue);

const setPasswordOptions = [
  {
    label: `${i18n.global.t('fields.create_user.set_password')}`,
    value: true,
  },
  {
    label: `${i18n.global.t('fields.create_user.generate_password')}`,
    value: false,
  },
];

const inviteOptions = [
  {
    label: `${i18n.global.t('general.yes')}`,
    value: true,
  },
  {
    label: `${i18n.global.t('general.no')}`,
    value: false,
  },
];

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    if (fieldValue.value?.isComplete()) {
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      store.setValue(props.stateKey, null);
    }
  } else if (fieldValue.value?.isComplete()) {
    emit('change', fieldValue.value);
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
