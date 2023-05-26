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
import { FLOOR } from 'src/data/ENUM';

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

const floorType = computed(() => {
  return fetchByKey({
    formKey: props.stateKey?.formKey as string,
    pageKey: 'formData',
    cardKey: 'tenantData',
    fieldKey: FIELDS.FLOOR.key,
  }) as FLOOR | null;
});

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

/**
 *  Set floor number to 0 if floor type is basement or upper floor
 *  @returns {void} - done
 */
watch(
  () => floorType.value,
  () => {
    if (
      floorType.value === FLOOR.BASEMENT ||
      floorType.value === FLOOR.UPPER_FLOOR
    ) {
      fieldValue.value = 0;
      showField.value = true;
      saveValue();
    } else {
      fieldValue.value = null;
      showField.value = false;
      saveValue();
    }
  }
);

/**
 * If no value in store yet, write default
 */
onBeforeMount(() => {
  if (!initialValue) {
    saveValue();
  }
});
</script>
