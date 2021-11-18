<template>
  <strong>{{ $t('domicile_address') }}</strong>
  <q-input
    dense
    :label="$t('street')"
    v-model="address"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_address')]"
    @change="emitValue"
  >
  </q-input>
  <div class="flex justify-between">
    <q-input
      dense
      :label="$t('number')"
      v-model="number"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_HOUSE_NUMBER(val) || $t('invalid_house_number')]"
      style="width:40%"
      mask="####"
      @change="emitValue"
    >
    </q-input>
    <q-input
      dense
      :label="$t('zip_code')"
      v-model="zip_code"
      type="number"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_ZIP(val) || $t('invalid_zip_code')]"
      style="width:40%"
      mask="######"
      @change="emitValue"
    >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
const emit = defineEmits(['change'])

const address = ref('')
const number = ref(null)
const zip_code = ref(null)

function emitValue(){
  emit('change', {
    street: address.value,
    number: number.value,
    zip_code: zip_code.value
    // TODO: City
    // TODO: Country
  })
}

</script>
