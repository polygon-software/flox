<template>
  <div class="text-left">
    <q-toggle
      v-if="optional"
      v-model="showBankInfo"
      :label="$t('authentication.bank_info')"
    />
    <div v-if="showBankInfo">
      <!-- Top Row: IBAN number -->
      <div class="row justify-between">
        <GenericInputField
          :label="$t('authentication.iban')"
          :initial-value="fieldValue.iban"
          class="col-12"
          mask="AA## XXXX XXXX XXXX XXXX X"
          :rules="[(val) => IS_VALID_IBAN(val) || $t('errors.invalid_iban')]"
          @change="(val) => (fieldValue.iban = val)"
        />
      </div>
      <!-- 2nd Row: bank name -->
      <div class="row justify-between">
        <GenericInputField
          :label="$t('authentication.bank_name')"
          :initial-value="fieldValue.bankName"
          class="col-12"
          :rules="[
            (val) => IS_VALID_STRING(val) || $t('errors.invalid_bank_name'),
          ]"
          @change="(val) => (fieldValue.bankName = val)"
        />
      </div>
      <!-- Bank address -->
      <AddressField
        :initial-value="fieldValue.address"
        @change="(val) => (fieldValue.address = val)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, Ref, watch } from 'vue';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';
import BankInfoInput from '../../../data/types/BankInfoInput';
import { IS_VALID_IBAN, IS_VALID_STRING } from '../../../data/RULES';

import GenericInputField from './GenericInputField.vue';
import AddressField from './AddressField.vue';

const props = withDefaults(
  defineProps<{
    stateKey: FormStateKey;
    optional?: boolean;
  }>(),
  {
    optional: false,
  }
);

const store = useFormStore();
const initialValue = props.stateKey ? fetchByKey(props.stateKey) : null;
const fieldValue: Ref<BankInfoInput> = ref(
  initialValue ? (initialValue as BankInfoInput) : new BankInfoInput()
);
const showBankInfo: Ref<boolean> = ref(!props.optional);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (fieldValue.value.isComplete()) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    store.setValue(props.stateKey, null);
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
</script>
