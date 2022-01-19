<template>
  <div
    v-for="(income, index) in incomes"
    :key="`income_${index}`"
    style="margin-bottom: 12px"
  >
    <q-input
      v-model.number="incomes[index]"
      dense
      type="number"
      :label="$t('form_for_clients.gross_income')+' '+ (index+1)"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @update:model-value="() => onChange(index)"
    />
  </div>

  <!-- Button for adding new incomes -->
  <q-btn
    size="sm"
    color="primary"
    icon="add"
    :disable="!incomes[incomes.length-1] || incomes.length === maxIncomes"
    round
    style="margin-bottom: 32px"
    @click="addIncome"
  />
</template>

<script setup lang="ts">
import {IS_VALID_NUMBER} from 'src/data/RULES'
import {ref} from 'vue';

const emit = defineEmits(['change'])

// Maximum number of separate incomes
const maxIncomes = 4

// Incomes
const incomes = ref([
  null,
])

/**
 * Adds an income whenever the plus button is clicked
 * @returns {void}
 */
function addIncome(){
  // Only if last is not null
  if(incomes.value[incomes.value.length-1] && incomes.value.length < maxIncomes){
    incomes.value.push(null)
  }

  emitIncomes()
}

/**
 * Upon changing an income value at a given index, update array & emit
 * @param {number} index - position in income array
 * @returns {void}
 */
function onChange(index: number){
  // If nothing was entered, remove
  if(incomes.value.length > 1 && (!incomes.value[index] || incomes.value[index] <= 0)){
    incomes.value.splice(index, 1)
  }

  // Emit new value
  emitIncomes()
}

/**
 * Emits the updated value of the incomes
 * @returns {void}
 */
function emitIncomes() {
  // Filter out empty fields
  const filteredIncomes = incomes.value.filter((income) => income !== undefined && income !== null)
  emit('change', filteredIncomes)
}

</script>
