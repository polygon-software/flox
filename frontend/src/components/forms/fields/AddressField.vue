<template>
  <!-- Top Row: Street & house number -->
  <div class="flex justify-between">
    <q-input
      v-model="address.street"
      dense
      :label="$t('account_data.street')"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_address')]"
      style="width:65%"
      @change="emitValue"
    />
    <q-input
      v-model="address.number"
      dense
      :label="$t('account_data.number')"
      type="text"
      :rules="[(val) => IS_VALID_HOUSE_NUMBER(val) || $t('errors.invalid_house_number')]"
      style="width:30%"
      @change="emitValue"
    />
  </div>
  <!-- Bottom Row: City & ZIP code -->
  <div class="flex justify-between">
    <q-input
      v-model="address.city"
      dense
      :label="$t('account_data.city')"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_city')]"
      style="width:65%"
      @change="emitValue"
    >
    </q-input>
    <q-input
      v-model="address.zipCode"
      dense
      :label="$t('account_data.zip_code')"
      type="number"
      :rules="[(val) => IS_VALID_ZIP(val) || $t('errors.invalid_zip_code')]"
      style="width:30%"
      mask="######"
      @change="emitValue"
    >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, reactive} from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
import {Address} from 'src/data/types/Address';
const emit = defineEmits(['change'])

const address = reactive(new Address())

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  emit('change', address)
}
</script>
