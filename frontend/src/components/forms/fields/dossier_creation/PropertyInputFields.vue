<template>
  <div>
    <q-input
      v-model.number="price"
      dense
      type="number"
      :label="$t('form_for_clients.price')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      lazy-rules
      @update:model-value="emitValue"
     ></q-input>
    <q-input
      v-model.number="marketValueEstimation"
      dense
      type="number"
      :label="$t('form_for_clients.market_value_estimation')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      lazy-rules
      @update:model-value="emitValue"
    ></q-input>
    <q-input
      v-model.number="currentValueOfMortgage"
      dense
      type="number"
      :label="$t('form_for_clients.current_value_of_mortgage')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      lazy-rules
      @update:model-value="emitValue"
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
import {IS_VALID_NUMBER} from 'src/data/RULES'
import {computed, ref} from 'vue';

const emit = defineEmits(['change'])

const price = ref(null)
const marketValueEstimation = ref(null)
const currentValueOfMortgage = ref(null)


/**
 * Automatically keeps enfeoffment calculation up to date
 * @returns {String}
 */
const enfeoffment = computed(()=>  {
  if(!currentValueOfMortgage.value || !price.value){
    return '-'
  }
  return `${((Math.abs(Number.parseInt(currentValueOfMortgage.value)) / Math.abs(Number.parseInt(price.value))) * 100).toFixed(2)}%`
})


/**
 * Emits the updated value, if all variables are valid
 * @returns {void}
 */
function emitValue() {
  if (IS_VALID_NUMBER(price.value) && IS_VALID_NUMBER(marketValueEstimation.value) && IS_VALID_NUMBER(currentValueOfMortgage.value)) {
    emit('change', {
      price: price.value,
      marketValueEstimation: marketValueEstimation.value,
      currentValueOfMortgage: currentValueOfMortgage.value
    })
  }
}

</script>
