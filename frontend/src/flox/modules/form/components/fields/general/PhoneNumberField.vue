<template>
  <div class="row justify-start">
    <LabelWrapper
      :label="$t('authentication.country_code')"
      style="width: 100px; margin-right: 32px"
    >
      <!-- Country code -->
      <q-select
        v-model="selectedCode"
        dense
        outlined
        :options="countryCodes"
        @update:model-value="phoneInput = null"
      />
    </LabelWrapper>

    <!-- Actual phone number -->
    <LabelWrapper
      :label="$t('authentication.phone')"
      style="width: calc(100% - 132px)"
    >
      <q-input
        v-model="phoneInput"
        dense
        outlined
        :mask="selectedCode.value.mask"
        :rules="
          optional
            ? [
                (val) =>
                  (!!val && val.length === 0) ||
                  IS_VALID_PHONE_NUMBER(
                    (selectedCode.value.value + val).replaceAll(' ', '')
                  ) ||
                  $t('errors.invalid_phone_number'),
              ]
            : [
                (val) =>
                  IS_VALID_PHONE_NUMBER(
                    (selectedCode.value.value + val).replaceAll(' ', '')
                  ) || $t('errors.invalid_phone_number'),
              ]
        "
      >
      </q-input>
    </LabelWrapper>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, watch } from 'vue';

import { IS_VALID_PHONE_NUMBER } from '../../../data/RULES';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';
import { PhoneCountryCode } from '../../../data/types/PhoneCountryCode';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    countryCodes: PhoneCountryCode[];
    stateKey?: FormStateKey;
    initialValue?: string; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    optional?: boolean; // Will disable mandatory checks
  }>(),
  {
    stateKey: undefined,
    initialValue: undefined,
    optional: true,
  }
);

const emit = defineEmits<{
  (e: 'change', selected: string | null): void;
}>();

const selectedCode: Ref<PhoneCountryCode | null> = ref(props.countryCodes[0]);
const phoneInput: Ref<string | null> = ref(null);

const store = useFormStore();
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as string | null)
  : props.initialValue;

// Actual field value (e.g. '+41 123 45 67')
const fieldValue: Ref<string | null> = ref(initialValue ?? null);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue(): void {
  if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    emit('change', fieldValue.value);
  }
}

onBeforeMount(() => {
  // If value is given, prefill selectedCode & phoneInput
  if (fieldValue.value) {
    const matchingCountryCode: PhoneCountryCode | null =
      props.countryCodes.find((countryCode) => {
        return fieldValue.value?.startsWith(countryCode.value);
      }) ?? null;
    if (matchingCountryCode) {
      selectedCode.value = matchingCountryCode;
      [, phoneInput.value] = fieldValue.value.split(matchingCountryCode.value);
    }
  } // No value given, just assign the first option in the list
  else {
    [selectedCode.value] = props.countryCodes;
  }
});

/**
 * Watch only phoneInput, since changing country code will reset this anyway
 */
watch(phoneInput, () => {
  if (selectedCode.value && phoneInput.value) {
    const newInput = (selectedCode.value.value + phoneInput.value).replaceAll(
      ' ',
      ''
    );

    // Check validity (otherwise save null)
    if (IS_VALID_PHONE_NUMBER(newInput)) {
      fieldValue.value = newInput;
    } else {
      fieldValue.value = null;
    }
  } else {
    fieldValue.value = null;
  }

  // Save state
  saveValue();
});
</script>
