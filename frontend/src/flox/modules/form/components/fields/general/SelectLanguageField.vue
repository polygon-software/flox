<template>
  <GenericSelectField
    :initial-value="fieldValue"
    :options="availableLanguageOptions()"
    :rules="[(val) => IS_NOT_NULL(val) || i18n.global.t('errors.no_selection')]"
    :label="label"
    @change="saveValue"
  >
  </GenericSelectField>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { IS_NOT_NULL } from '../../../data/RULES';
import availableLanguageOptions from '../../../helpers/generation-helpers';
import { fetchByKey } from '../../../helpers/form-helpers';

import GenericSelectField from './GenericSelectField.vue';

const props = withDefaults(
  defineProps<{
    stateKey: FormStateKey;
    label?: string | null;
  }>(),
  {
    label: i18n.global.t('fields.personal_data.language'),
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
