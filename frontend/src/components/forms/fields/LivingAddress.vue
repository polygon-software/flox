<template>
  <strong>{{ $t('living_address') }}</strong>
  <q-input
    v-model="street"
    dense
    :label="$t('account_data.street')"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_address')]"
  >
  </q-input>
  <div class="flex justify-between">
    <q-input
      v-model="number"
      dense
      :label="$t('account_data.number')"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_HOUSE_NUMBER(val) || $t('errors.invalid_house_number')]"
      style="width:40%"
      mask="####"
    >
    </q-input>
    <q-input
      v-model="city"
      dense
      :label="$t('account_data.city')"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_city')]"
      style="width:40%"
    >
    </q-input>
    <q-input
      v-model="zip_code"
      dense
      :label="$t('account_data.zip_code')"
      type="number"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_ZIP(val) || $t('errors.invalid_zip_code')]"
      style="width:40%"
      mask="######"
    >
    </q-input>
    <q-input
      v-model="state"
      dense
      :label="$t('account_data.state')"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_state')]"
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
watch(number, (newValue: string|number) => {
  emitUpdate(newValue)
})
watch(city, (newValue) => {
  emitUpdate(newValue)
})
watch(zip_code, (newValue: string|number) => {
  emitUpdate(newValue)
})
watch(state, (newValue) => {
  emitUpdate(newValue)
})

/**
 * Emits an event with the new values
 * @param {string|number} value - the address field's value
 * @returns {void}
 */
function emitUpdate(value: string|number): void {
  if (street.value.length > 0 && number.value > 0 && city.value.length > 0, zip_code.value > 0 && state.value.length > 0) {
    emit('change', value)
  }
  else {
    emit('change', '')
  }
}
</script>
