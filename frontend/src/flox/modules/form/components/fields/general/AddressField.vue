<template>
  <p v-if="title" class="q-my-md text-subtitle1">
    {{ title }}
  </p>
  <!-- Top Row: Street & house number -->
  <div class="row justify-between">
    <div class="col-8">
      <LabelWrapper :label="$t('address.street')">
        <q-input
          v-model="fieldValue.street"
          dense
          outlined
          type="text"
          :rules="[
            (val) => IS_VALID_STRING(val) || $t('errors.invalid_address'),
          ]"
          @change="saveValue"
        />
      </LabelWrapper>
    </div>
    <div class="col-3">
      <LabelWrapper :label="$t('address.number')">
        <q-input
          v-model="fieldValue.number"
          dense
          outlined
          type="text"
          :rules="[
            (val) => IS_VALID_HOUSE_NUMBER(val) || $t('errors.invalid_number'),
          ]"
          @change="saveValue"
        />
      </LabelWrapper>
    </div>
  </div>
  <!-- Bottom Row: ZIP code & city -->
  <div class="row justify-between">
    <div class="col-3">
      <LabelWrapper :label="$t('address.zipCode')">
        <q-input
          v-model="fieldValue.zipCode"
          dense
          outlined
          type="text"
          :rules="[(val) => IS_VALID_ZIP(val) || $t('errors.invalid_zip_code')]"
          mask="####"
          @change="saveValue"
        />
      </LabelWrapper>
    </div>
    <div class="col-8">
      <LabelWrapper :label="$t('address.city')">
        <q-input
          v-model="fieldValue.city"
          dense
          outlined
          type="text"
          :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_city')]"
          @change="saveValue"
        />
      </LabelWrapper>
    </div>
  </div>
  <div v-if="showAdditionalAddress" class="row">
    <div class="col-12">
      <LabelWrapper :label="$t('address.additionalAddress')">
        <q-input
          v-model="fieldValue.additionalAddress"
          dense
          outlined
          type="text"
          :rules="[
            (val) =>
              !val ||
              IS_VALID_STRING(val) ||
              $t('errors.invalid_additional_address'),
          ]"
          @change="saveValue"
        />
      </LabelWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {
  IS_VALID_STRING,
  IS_VALID_HOUSE_NUMBER,
  IS_VALID_ZIP,
} from '../../../data/RULES';
import AddressInput from '../../../data/types/AddressInput';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    // User to fetch and save the address data to/from the store. If not given, this field emits instead of saving
    stateKey?: FormStateKey | null;
    // Title of the field
    title?: string | null;
    // Only considered when stateKey is null, so this field can be a non-saving subfield of other fields
    initialValue?: AddressInput | null;
    // Wheter additional information about the address can be given
    showAdditionalAddress?: boolean;
  }>(),
  {
    stateKey: null,
    title: null,
    initialValue: null,
    showAdditionalAddress: false,
  }
);

const emit = defineEmits<{
  (e: 'change', value: AddressInput | null): void;
}>();

const store = useFormStore();
const initialValue = props.stateKey
  ? fetchByKey(props.stateKey)
  : props.initialValue;

const fieldValue = ref(
  initialValue ? (initialValue as AddressInput) : new AddressInput()
);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (!!fieldValue.value && fieldValue.value.isComplete()) {
    if (props.stateKey) {
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      emit('change', fieldValue.value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  } else {
    emit('change', null);
  }
}
</script>
