<template>
  <GenericSelectField
    :initial-value="fieldValue"
    :options="options"
    :rules="[(val) => IS_NOT_NULL(val) || i18n.global.t('errors.no_selection')]"
    :label="label"
    @change="(val) => (typeof val === 'string' ? saveValue(val) : null)"
  >
  </GenericSelectField>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { IS_NOT_NULL } from '../../../data/RULES';
import { availableUserRoles } from '../../../helpers/generation-helpers';
import { fetchByKey } from '../../../helpers/form-helpers';
import { GenericOption } from '../../../data/types/GenericOption';

import GenericSelectField from './GenericSelectField.vue';

const props = withDefaults(
  defineProps<{
    stateKey: FormStateKey;
    label?: string;
    options?: GenericOption[];
  }>(),
  {
    label: i18n.global.t('fields.authentication.user_role'),
    options: () => availableUserRoles(),
  }
);

const store = useFormStore();

const fieldValue: Ref<string | null> = ref(
  (fetchByKey(props.stateKey) as string) ?? null
);

/**
 * Saves the updated value
 * @param value - the updated value
 * @returns void
 */
function saveValue(value: string): void {
  store.setValue(props.stateKey, value);
}
</script>
