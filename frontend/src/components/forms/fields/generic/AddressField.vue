<template>
  <!-- Top Row: Street & house number -->
  <div class="flex justify-between">
    <q-input
      dense
      :label="$t('street')"
      v-model="address.street"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_address')]"
      style="width:65%"
      @change="emitValue"
    />
    <q-input
      dense
      :label="$t('number')"
      v-model="address.number"
      type="text"
      :rules="[(val) => IS_VALID_HOUSE_NUMBER(val) || $t('invalid_house_number')]"
      style="width:30%"
      @change="emitValue"
    />
  </div>
  <!-- Bottom Row: City & ZIP code -->
  <div class="flex justify-between">
    <q-input
      dense
      :label="$t('city')"
      v-model="address.city"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_city')]"
      style="width:65%"
      @change="emitValue"
    >
    </q-input>
    <q-input
      dense
      :label="$t('zip_code')"
      v-model="address.zip_code"
      type="number"
      :rules="[(val) => IS_VALID_ZIP(val) || $t('invalid_zip_code')]"
      style="width:30%"
      mask="######"
      @change="emitValue"
    >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
import {Address} from 'src/data/types/Address';
const emit = defineEmits(['change'])

const address = reactive(new Address())

/**
 * Emits the updated value, if it is valid
 */
function emitValue(){
  if(address.validate()){
    emit('change', address)
  }

}
</script>
