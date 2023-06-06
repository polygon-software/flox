<template>
  <div v-if="showTitle" class="q-mb-md text-subtitle1 text-left text-primary">
    {{ $t('fields.personal_data.sample_title') }}
  </div>
  <div class="row">
    <!-- First name -->
    <GenericInputField
      :label="$t('fields.personal_data.first_name')"
      :rules="optional ? [] : [IS_VALID_NAME]"
      :initial-value="fieldValue.firstName"
      outlined
      dense
      @change="(newValue) => fieldValueChange('firstName', newValue)"
    />

    <!-- Middle name -->
    <GenericInputField
      v-if="showOptionalFields"
      :label="$t('fields.personal_data.middle_name')"
      :rules="optional ? [] : [IS_VALID_NAME]"
      :initial-value="fieldValue.middleName"
      outlined
      dense
      @change="(newValue) => fieldValueChange('middleName', newValue)"
    />
  </div>
  <div class="row">
    <!-- Last name -->
    <GenericInputField
      :label="$t('fields.personal_data.last_name')"
      :rules="optional ? [] : [IS_VALID_NAME]"
      :initial-value="fieldValue.lastName"
      outlined
      dense
      @change="(newValue) => fieldValueChange('lastName', newValue)"
    />

    <!-- Second last name -->
    <GenericInputField
      v-if="showOptionalFields"
      v-model="fieldValue.secondLastName"
      :label="$t('fields.personal_data.second_last_name')"
      :rules="optional ? [] : [IS_VALID_NAME]"
      :initial-value="fieldValue.secondLastName"
      @change="(newValue) => fieldValueChange('secondLastName', newValue)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from 'vue';

import FullName from 'src/flox/modules/form/data/types/FullName';

import { IS_VALID_NAME } from '../../../data/RULES';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

import GenericInputField from './GenericInputField.vue';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null; // If not given, this field emits instead of saving
    initialValue?: FullName | null; // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    showOptionalFields?: boolean; // Whether to show the optional fields (middle name, second last name)
    showTitle?: boolean;
    optional?: boolean;
  }>(),
  {
    stateKey: null,
    initialValue: null,
    showOptionalFields: true,
    showTitle: false,
    optional: false,
  }
);

const emit = defineEmits<{
  (e: 'change', value: FullName | null): void;
}>();

const store = useFormStore();
const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as FullName | undefined)
  : (props.initialValue as FullName | undefined);

const fieldValue: Ref<FullName> = ref(initialValue || new FullName());

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    if (fieldValue.value) {
      const fullName = new FullName(
        fieldValue.value.firstName,
        undefined,
        fieldValue.value.lastName
      );
      // Replace empty strings with undefined
      fullName.fixEmptyStrings();
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
 * Updates the field value if a subfield updates.
 * @param fieldKey - name of the field to update
 * @param value - new value
 * @returns void
 */
function fieldValueChange(
  fieldKey: 'firstName' | 'middleName' | 'lastName' | 'secondLastName',
  value: unknown
): void {
  fieldValue.value[fieldKey] = value as string;
}
</script>
