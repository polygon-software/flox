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
import { PropType, ref, defineProps, Ref, watch } from 'vue';
import { IS_VALID_IBAN, IS_VALID_STRING } from 'src/data/RULES';
import { BankInfoInput } from 'src/data/types/BankInfoInput';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';

import GenericInputField from 'src/flox/modules/form/components/fields/general/GenericInputField.vue';
import AddressField from 'src/flox/modules/form/components/fields/general/AddressField.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: true,
  },
  optional: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const store = useFormStore();
const initialValue = props.stateKey ? fetchByKey(props.stateKey) : null;
const fieldValue: Ref<BankInfoInput> = ref(
  initialValue ? (initialValue as BankInfoInput) : new BankInfoInput()
);
const showBankInfo: Ref<boolean> = ref(!props.optional);
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
  if (fieldValue.value.isComplete()) {
    store.setValue(props.stateKey, fieldValue.value);
  } else {
    store.setValue(props.stateKey, null);
  }
}
</script>
