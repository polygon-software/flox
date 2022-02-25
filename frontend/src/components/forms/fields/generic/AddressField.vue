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
      v-model="address.zip_code"
      dense
      :label="$t('account_data.zip_code')"
      type="text"
      :rules="[(val) => IS_VALID_ZIP(val) || $t('errors.invalid_zip_code')]"
      style="width:30%"
      mask="######"
      @change="emitValue"
    >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {PropType, reactive} from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
import {Address} from 'src/data/types/Address';
import {getAuthToken} from 'src/helpers/cookie-helpers';
import axios from 'axios';
const emit = defineEmits(['change'])

const props = defineProps({
  initialValue: {
    type: Object as PropType<Address>,
    required: false,
    default: () => new Address()
  },
  validateZip: {
    type: Boolean,
    required: false,
    default: false
  }
})

const address = reactive(props.initialValue)

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
async function emitValue(){
  if(address.validate()){
    if(props.validateZip){
      const zipValid = await isZipCodeValid()
      if(zipValid){
        emit('change', address)
      } else {
        emit('change', null)
      }
    } else {
      emit('change', address)
    }
  } else {
    emit('change', null)
  }
}

/**
 * Determines whether the currently entered zip code is valid
 * @returns {Promise<boolean>} - whether it's valid
 */
async function isZipCodeValid(){
  // Ensure user has token
  const token: string|null = getAuthToken();

  if(!address || !token){
    return false
  }

  const zipCode = address.zip_code as string

  const headers = {
    Authorization: `Bearer ${token}`
  }
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''
  const url = `${baseUrl}/isZipCodeValid?zipCode=${zipCode}`

  // Get value multiplier from backend
  const isValidRequest = await axios.get(url, {headers});
  return isValidRequest.data as boolean;
}
</script>
