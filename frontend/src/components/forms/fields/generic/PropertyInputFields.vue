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
const marketValueEstimation = ref('')
const currentValueOfMortgage = ref('')


/**
 * Automatically keeps enfoffmenet calculation up to date
 * @returns {String}
 */
let enfeoffment = computed(()=>  {
  if(!currentValueOfMortgage.value || !price.value){
    return '-'
  }
  return `${(Math.abs(Number.parseInt(currentValueOfMortgage.value)) / Math.abs(Number.parseInt(price.value))) * 100}%`
})


/**
 * Emits the updated value of the price, if it is valid
 * @returns {void}
 */
function emitValuePrice() {
  if(IS_VALID_STRING(price.value)){
    emit('change', price)
  }
}
/**
 * Emits the updated value of the estimated market value, if it is valid
 * @returns {void}
 */
function emitValueMarketValue() {
  if(IS_VALID_STRING(marketValueEstimation.value)) {
    emit('change', marketValueEstimation)
  }
}
/**
 * Emits the updated value of the mortgage, if it is valid
 * @returns {void}
 */
function emitValueMortgage() {
  if(IS_VALID_STRING(currentValueOfMortgage.value)) {
    emit('change', currentValueOfMortgage)
  }
}

</script>
