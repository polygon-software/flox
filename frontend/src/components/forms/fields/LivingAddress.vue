<template>
  <strong>{{ $t('living_address') }}</strong>
  <q-input
    dense
    :label="$t('street')"
    v-model="street"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_address')]"
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
    >
    </q-input>
    <q-input
      dense
      :label="$t('city')"
      v-model="city"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_city')]"
      style="width:40%"
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
    >
    </q-input>
    <q-input
      dense
      :label="$t('state')"
      v-model="state"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_state')]"
      style="width:40%"
    >
    </q-input>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
const street = ref('')
const number = ref()
const city = ref('')
const zip_code = ref()
const state = ref('')

//TODO: Change to a single address to be watched
const emit = defineEmits(['change'])
watch(street, (newValue) => {
  emitUpdate(newValue)
})
watch(number, (newValue) => {
  emitUpdate(newValue)
})
watch(city, (newValue) => {
  emitUpdate(newValue)
})
watch(zip_code, (newValue) => {
  emitUpdate(newValue)
})
watch(state, (newValue) => {
  emitUpdate(newValue)
})

function emitUpdate(value: string|number) {
  if (street.value.length > 0 && number.value > 0 && city.value.length > 0, zip_code.value > 0 && state.value.length > 0) {
    emit('change', value)
  }
  else {
    emit('change', '')
  }
}
</script>
