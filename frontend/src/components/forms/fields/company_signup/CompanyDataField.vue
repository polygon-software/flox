<template>
<div>
  <strong>{{ $t('company') }}</strong>
  <q-input
    v-model="company_name"
    dense
    type="text"
    :label="$t('company_name')"
    :rules="[(val) => IS_VALID_STRING(val) || i18n.global.t('invalid_company_name')]"
    @change="emitValue"
  >
  </q-input>
  <q-input
    v-model="company_uid"
    dense
    type="text"
    :label="$t('company_uid') + ' (optional)'"
    @change="emitValue"
  />
  <q-checkbox
    v-model="branch_structure"
    :label="$t('branch_structure')"
    @update:model-value="emitValue"
  />
</div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING } from 'src/data/RULES';
import {i18n} from 'boot/i18n';

const emit = defineEmits(['change'])

const company_name = ref('')
const company_uid = ref('')
const branch_structure = ref(false)

function emitValue(){
  emit('change', {
    company_name: company_name.value,
    uid: company_uid.value,
    branch_structure: branch_structure.value,
  })
}
</script>
