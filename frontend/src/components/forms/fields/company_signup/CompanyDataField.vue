<template>
<div>
  <strong>{{ $t('account_data.company') }}</strong>
  <q-input
    v-model="companyName"
    dense
    type="text"
    :label="$t('account_data.company_name')"
    :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_company_name')]"
    @change="emitValue"
  >
  </q-input>
  <q-input
    v-model="companyUid"
    dense
    type="text"
    :label="`${$t('account_data.company_uid')} (${$t('account_data.optional')})`"
    @change="emitValue"
  />
  <q-checkbox
    v-model="branchStructure"
    :label="$t('account_data.branch_structure')"
    @update:model-value="emitValue"
  />
</div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING } from 'src/data/RULES';

const emit = defineEmits(['change'])

const companyName = ref('')
const companyUid = ref('')
const branchStructure = ref(false)

/**
 * Emits the inputs
 * @returns {void}
 */
function emitValue(){
  emit('change', {
    company_name: companyName.value,
    uid: companyUid.value,
    branch_structure: branchStructure.value,
  })
}
</script>
