<template>
  <LabelWrapper v-if="showField" :label="i18n.global.t('fields.floor_number')">
    <q-input
      v-model="fieldValue"
      dense
      type="number"
      outlined
      :rules="[IS_NOT_NULL]"
      @change="saveValue"
    />
  </LabelWrapper>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';

import { i18n } from 'boot/i18n';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';

import { IS_NOT_NULL } from '../../../data/RULES';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = defineProps<{
  stateKey: FormStateKey | null;
}>();

const store = useFormStore();
const initialValue = (props.stateKey ? fetchByKey(props.stateKey) : null) as
  | number
  | undefined;

// Actual field value
const fieldValue = ref(initialValue ?? null);

const showField = ref(false);

/**
 * Save or emit the updated value
 */
function saveValue(): void {
  // If field is filled, save as actual parsed number
  if (!!fieldValue.value || fieldValue.value === 0) {
    const value = Number(fieldValue.value);
    if (props.stateKey) {
      store.setValue(props.stateKey, value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  }
}

</script>
