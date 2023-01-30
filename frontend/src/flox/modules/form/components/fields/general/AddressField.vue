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
  <!-- Bottom Row: City & ZIP code -->
  <div class="row justify-between">
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
    <div class="col-3">
      <LabelWrapper :label="$t('address.zipCode')">
        <q-input
          ref="zipRef"
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
import { ref, PropType } from 'vue';
import {
  IS_VALID_STRING,
  IS_VALID_HOUSE_NUMBER,
  IS_VALID_ZIP,
} from 'src/data/RULES';
import { AddressInput } from 'src/data/types/AddressInput';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  title: {
    type: String,
    required: false,
    default: null,
  },
  // Only considered when stateKey is null,
  // so this field can be a non-saving subfield of other fields
  initialValue: {
    type: Object as PropType<AddressInput>,
    required: false,
    default: null,
  },
  showAdditionalAddress: {
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
  initialValue ? (initialValue as AddressInput) : new AddressInput()
);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns {void}
 */
function saveValue() {
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
