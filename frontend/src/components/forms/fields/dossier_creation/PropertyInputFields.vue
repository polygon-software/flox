<template>
  <div>
    <q-input
      v-model="price"
      dense
      type="text"
      :label="$t('form_for_clients.price')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitValuePrice"
     ></q-input>
    <q-input
      v-model="marketValueEstimation"
      dense
      type="text"
      :label="$t('form_for_clients.market_value_estimation')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitValueMarketValue"
    ></q-input>
    <q-input
      v-model="currentValueOfMortgage"
      dense
      type="text"
      :label="$t('form_for_clients.current_value_of_mortgage')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitValueMortgage"
    ></q-input>
    <q-input
      :model-value="enfeoffment"
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
import {IS_VALID_NUMBER} from 'src/data/RULES'
import {computed, ref} from 'vue';

const emit = defineEmits(['change'])

const price = ref(null)
const marketValueEstimation = ref(null)
const currentValueOfMortgage = ref(null)


/**
 * Automatically keeps enfoffmenet calculation up to date
 * @returns {String}
 */
const enfeoffment = computed(()=>  {
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
  if(IS_VALID_NUMBER(price.value)){
    emit('change', price)
  }
}
/**
 * Emits the updated value of the estimated market value, if it is valid
 * @returns {void}
 */
function emitValueMarketValue() {
  if(IS_VALID_NUMBER(marketValueEstimation.value)) {
    emit('change', marketValueEstimation)
  }
}
/**
 * Emits the updated value of the mortgage, if it is valid
 * @returns {void}
 */
function emitValueMortgage() {
  if(IS_VALID_NUMBER(currentValueOfMortgage.value)) {
    emit('change', currentValueOfMortgage)
  }
}

</script>
