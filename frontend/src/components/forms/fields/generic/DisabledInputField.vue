<template>
  <div>
    <q-input
      :model-value="price"
      dense
      :label="$t('form_for_clients.price')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValuePrice"
     ></q-input>
    <q-input
      :model-value="market_value_estimation"
      dense
      :label="$t('form_for_clients.market_value_estimation')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValueMarketValue"
    ></q-input>
    <q-input
      :model-value="current_value_of_mortgage"
      dense
      :label="$t('form_for_clients.current_value_of_mortgage')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValueMortgage"
    ></q-input>
    <q-input
      :model-value="current_value_of_mortgage"
      dense
      readonly
      :label="$t('form_for_clients.enfeoffment')"
      >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {IS_VALID_STRING} from 'src/data/RULES'

const emit = defineEmits(['change'])

const price = ""
const market_value_estimation = ""
const current_value_of_mortgage = ""

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValuePrice() {
  emit('change', price)
}
/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValueMarketValue() {
  emit('change', market_value_estimation)
}
/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValueMortgage() {
  emit('change', current_value_of_mortgage)
}


// const enfeoffment = (current_value_of_mortgage / price) ?? 0

</script>
