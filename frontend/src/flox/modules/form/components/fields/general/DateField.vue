<template>
  <LabelWrapper :label="label">
    <q-input
      v-model="fieldValue"
      :rules="
        optional
          ? [
              (val) =>
                !val ||
                IS_VALID_DATE_STRING(val, dateFormat) ||
                $t('errors.invalid_date'),
              ...fixedRules,
            ]
          : [
              (val) =>
                IS_VALID_DATE_STRING(val, dateFormat) ||
                $t('errors.invalid_date'),
              ...fixedRules,
            ]
      "
      :type="dateFormat === 'YYYY-MM-DD' ? 'date' : 'text'"
      :hint="hint"
      :mask="mask"
      outlined
      dense
      @change="saveValue"
    />
  </LabelWrapper>
  <!-- Spacer to keep padding consistent to fields that have rules (where quasar auto-adds padding) -->
  <div v-if="rules.length < 1" style="height: 20px" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { date } from 'quasar';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';
import { i18n } from 'boot/i18n';

import { IS_VALID_DATE_STRING } from '../../../data/RULES';
import { fetchByKey } from '../../../helpers/form-helpers';
import { FormStateKey, useFormStore } from '../../../stores/form';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null;
    dateFormat?: string;
    label?: string;
    hint?: string;
    rules?: ((val: unknown) => string | boolean)[];
    initialValue?: Date | null; // Only considered when stateKey is null,
    // so this field can be a non-saving subfield of other fields
    optional?: boolean;
  }>(),
  {
    stateKey: null,
    dateFormat: 'YYYY-MM-DD',
    label: i18n.global.t('fields.date.date'),
    hint: undefined,
    rules: () => [],
    initialValue: null,
    optional: false,
  }
);

const emit = defineEmits<{
  (e: 'change', value: unknown): void;
}>();

const store = useFormStore();
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;

// Value is a string, stored in store as a Date
const fieldValue = ref(
  initialValue ? date.formatDate(initialValue as Date, props.dateFormat) : null
);

// Mask, determined based on dateFormat (if given)
const mask = computed(() => {
  if (props.dateFormat === 'YYYY-MM-DD') {
    return 'date';
  }

  return props.dateFormat.replaceAll(/[yYmMdDhHsS]/g, '#');
});

/**
 * Rules prop, fixed to properly be able to be applied to field itself (since field emits string, but
 * rules should expect dates)
 */
const fixedRules = computed(() => {
  const result: ((val: string) => string | boolean)[] = [];

  // For every rule, adapt such that value is converted to date before being passed to rule
  props.rules?.forEach((rule) => {
    const fixedRule = (val: string): boolean | string => {
      const convertedDate = date.extractDate(val, props.dateFormat);
      return rule(convertedDate);
    };
    result.push(fixedRule);
  });

  return result;
});

/**
 * If initialValue changes (and no stateKey is set), update field contents to new initialValue
 */
watch(
  () => props.initialValue,
  () => {
    if (props.initialValue) {
      const newDate = date.formatDate(props.initialValue, props.dateFormat);
      if (!props.stateKey && fieldValue.value !== newDate) {
        fieldValue.value = newDate;
      }
    }
  }
);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (
    fieldValue.value &&
    IS_VALID_DATE_STRING(fieldValue.value, props.dateFormat)
  ) {
    // Convert to actual date object
    const actualDate = date.extractDate(fieldValue.value, props.dateFormat);
    if (props.stateKey) {
      store.setValue(props.stateKey, actualDate);
    } else {
      emit('change', actualDate);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  } else {
    emit('change', null);
  }
}
</script>
