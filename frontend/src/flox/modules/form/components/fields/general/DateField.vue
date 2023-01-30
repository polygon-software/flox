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
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from 'vue';
import { date, ValidationRule } from 'quasar';
import { IS_VALID_DATE_STRING } from 'src/data/RULES';
import { fetchByKey } from 'src/helpers/form/form-helpers';
import { FormStateKey, useFormStore } from 'stores/form';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';
import { i18n } from 'boot/i18n';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  dateFormat: {
    type: String,
    required: false,
    default: 'YYYY-MM-DD',
  },
  label: {
    type: String,
    required: false,
    default: i18n.global.t('dossier.privateCustomer.birthdate'),
  },
  hint: {
    type: String,
    required: false,
    default: null,
  },
  rules: {
    type: Array as PropType<ValidationRule[]>,
    required: false,
    default: () => [],
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: Object as PropType<Date>,
    required: false,
    default: null,
  },
  optional: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['change']);

const store = useFormStore();
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;

// Value is a string, stored in stores as a Date
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
  const result: ValidationRule[] = [];

  // For every rule, adapt such that value is converted to date before being passed to rule
  props.rules?.forEach((rule: ValidationRule<boolean | string>) => {
    const fixedRule = (val: string): boolean | string => {
      const convertedDate = date.extractDate(val, props.dateFormat);
      return rule(convertedDate) as boolean | string;
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
    const newDate = date.formatDate(props.initialValue, props.dateFormat);
    if (!props.stateKey && fieldValue.value !== newDate) {
      fieldValue.value = newDate;
    }
  }
);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue() {
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
