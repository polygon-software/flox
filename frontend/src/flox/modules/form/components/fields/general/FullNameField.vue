<template>
  <div v-if="showTitle" class="q-mb-md text-subtitle1 text-left text-primary">
    {{ $t('dossier.businessCustomer.authorizedPerson') }}
  </div>
  <div class="q-gutter-sm row">
    <!-- First name -->
    <GenericInputField
      :label="$t('dossier.privateCustomer.firstName')"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_name')]"
      :initial-value="fieldValue.firstName"
      outlined
      dense
      @change="(val) => (fieldValue.firstName = val)"
    />

    <!-- Middle name -->
    <GenericInputField
      v-if="showOptionalFields"
      :label="$t('dossier.privateCustomer.middleName')"
      :rules="[
        (val) => !val || IS_VALID_STRING(val) || $t('errors.invalid_name'),
      ]"
      :initial-value="fieldValue.middleName"
      outlined
      dense
      @change="(val) => (fieldValue.middleName = val)"
    />
  </div>
  <div class="q-gutter-sm row">
    <!-- Last name -->
    <GenericInputField
      :label="$t('dossier.privateCustomer.lastName')"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_name')]"
      :initial-value="fieldValue.lastName"
      outlined
      dense
      @change="(val) => (fieldValue.lastName = val)"
    />

    <!-- Second last name -->
    <GenericInputField
      v-if="showOptionalFields"
      v-model="fieldValue.secondLastName"
      :label="$t('dossier.privateCustomer.secondLastName')"
      :rules="[
        (val) => !val || IS_VALID_STRING(val) || $t('errors.invalid_name'),
      ]"
      :initial-value="fieldValue.secondLastName"
      outlined
      dense
      @change="(val) => (fieldValue.secondLastName = val)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, PropType, watch } from 'vue';
import { IS_VALID_STRING } from 'src/data/RULES';
import { FullName } from 'src/data/types/dossierFields/FullName';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';

import GenericInputField from 'src/flox/modules/form/components/fields/general/GenericInputField.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: Object as PropType<FullName>,
    required: false,
    default: null,
  },
  // Whether to show the optional fields (middle name, second last name)
  showOptionalFields: {
    type: Boolean,
    required: false,
    default: true,
  },
  showTitle: {
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
const fieldValue: Ref<FullName> = ref(
  initialValue ? (initialValue as FullName) : new FullName()
);

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

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue() {
  if (props.stateKey) {
    if (fieldValue.value.isComplete()) {
      // Replace empty strings with undefined
      fieldValue.value.fixEmptyStrings();
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      store.setValue(props.stateKey, null);
    }
  } else if (fieldValue.value.isComplete()) {
    emit('change', fieldValue.value);
  } else {
    emit('change', null);
  }
}
</script>
