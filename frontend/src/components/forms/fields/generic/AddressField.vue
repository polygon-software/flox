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
      ref="zipRef"
      v-model="address.zip_code"
      dense
      :label="$t('account_data.zip_code')"
      type="text"
      :rules="[(val) => IS_VALID_ZIP(val, validateZip) || $t('errors.invalid_zip_code')]"
      style="width:30%"
      mask="######"
      :debounce="validateZip ? 200 : 0"
      @change="emitValue"
    >
    </q-input>
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
  </div>
</template>

<script setup lang="ts">
import {defineEmits, PropType, reactive, ref, Ref} from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
import {Address} from 'src/data/types/Address';
import {QInput} from 'quasar';
const emit = defineEmits(['change'])

const props = defineProps({
  initialValue: {
    type: Object as PropType<Address>,
    required: false,
    default: null,
  },
  validateZip: {
    type: Boolean,
    required: false,
    default: false
  }
})

const address = reactive(props.initialValue ? new Address(
  props.initialValue?.street as string,
  props.initialValue?.number as string,
  props.initialValue?.city as string,
  props.initialValue?.zip_code as string,
) : new Address())
const zipRef: Ref<QInput|null> = ref(null)

/**
 * Emits the updated value, if it is valid (otherwise emits null)
 * @returns {Promise<void>} - done
 */
async function emitValue(){
  const zipValidated = props.validateZip ? await zipRef.value?.validate() : true
  if(address.validate() && zipValidated){
    emit('change', address)
  } else {
    emit('change', null)
  }
}

</script>
