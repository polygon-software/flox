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
        :mask="selectedCode === countryCodes[0] ? '## ### ## ##' : '### ## ##'"
        :rules="
          optional
            ? [
                (val) =>
                  (!!val && val.length === 0) ||
                  IS_VALID_PHONE_NUMBER(
                    (selectedCode + val).replaceAll(' ', '')
                  ) ||
                  $t('errors.invalid_phone_number'),
              ]
            : [
                (val) =>
                  IS_VALID_PHONE_NUMBER(
                    (selectedCode + val).replaceAll(' ', '')
                  ) || $t('errors.invalid_phone_number'),
              ]
        "
      >
      </q-input>
    </LabelWrapper>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, PropType, ref, Ref, watch } from 'vue';
import { IS_VALID_PHONE_NUMBER } from 'src/data/RULES';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: String,
    required: false,
    default: null,
  },
  // Will disable mandatory checks
  optional: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(['change']);

const countryCodes: string[] = ['+41', '+423'];

// Selected country code (e.g. '+41')
const selectedCode: Ref<string | null> = ref(countryCodes[0]);
// Phone number input (e.g. '123 45 67')
const phoneInput: Ref<string | null> = ref(null);

const store = useFormStore();
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as string | null)
  : props.initialValue;

// Actual field value (e.g. '+41 123 45 67')
const fieldValue: Ref<string | null> = ref(initialValue);

onBeforeMount(() => {
  // If value is given, prefill selectedCode & phoneInput
  if (fieldValue.value) {
    for (const code of countryCodes) {
      if (fieldValue.value.startsWith(code)) {
        selectedCode.value = code;
        phoneInput.value = fieldValue.value.split(code)[1];
        break;
      }
    }
  }
});

/**
 * Watch only phoneInput, since changing country code will reset this anyways
 */
watch(phoneInput, () => {
  if (selectedCode.value && phoneInput.value) {
    const newInput = (selectedCode.value + phoneInput.value).replaceAll(
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

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue() {
  if (props.stateKey) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    emit('change', fieldValue.value);
  }
}
</script>
