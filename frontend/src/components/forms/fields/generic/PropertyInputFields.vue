<template>
  <div>
    <q-input
      v-model="price"
      dense
      type="text"
      :label="$t('form_for_clients.price')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValuePrice"
     ></q-input>
    <q-input
      v-model="market_value_estimation"
      dense
      type="text"
      :label="$t('form_for_clients.market_value_estimation')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValueMarketValue"
    ></q-input>
    <q-input
      v-model="current_value_of_mortgage"
      dense
      type="text"
      :label="$t('form_for_clients.current_value_of_mortgage')"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValueMortgage"
    ></q-input>
    <q-input
      v-model="enfeoffment"
      type="text"
      dense
      disable
      label-color="black"
      :label="$t('form_for_clients.enfeoffment')"
      >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {IS_VALID_STRING} from 'src/data/RULES'
import {computed, ref} from 'vue';

const emit = defineEmits(['change'])

const price = ref('')
const market_value_estimation = ref('')
const current_value_of_mortgage = ref('')


/**
 * Automatically keeps enfoffmenet calculation up to date
 * @returns {String}
 */
let enfeoffment = computed(()=>  {
  if(!current_value_of_mortgage.value || !price.value){
    return '-'
  }
  return `${(Math.abs(Number.parseInt(current_value_of_mortgage.value)) / Math.abs(Number.parseInt(price.value))) * 100}%`
})


/**
 * Emits the updated value of the price, if it is valid
 * @returns {void}
 */
function emitValuePrice() {
  emit('change', price)
}
/**
 * Emits the updated value of the estimated market value, if it is valid
 * @returns {void}
 */
function emitValueMarketValue() {
  emit('change', market_value_estimation)
}
/**
 * Emits the updated value of the mortgage, if it is valid
 * @returns {void}
 */
function emitValueMortgage() {
  emit('change', current_value_of_mortgage)
}



</script>
