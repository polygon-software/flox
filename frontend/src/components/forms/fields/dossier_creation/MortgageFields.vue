<template>
  <div
    v-for="(partition, index) in mortgagePartitions"
    :key="`partition_${index}`"
    style="margin-bottom: 12px"
  >
    <q-input
      v-model.number="partition.amount"
      dense
      type="number"
      :label="$t('form_for_clients.portion')+' '+ (index+1)"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitPartitions"
    ></q-input>
    <q-input
      v-model="partition.date"
      type="date"
      dense
      :label="$t('dossier.expiration_date')"
      @change="checkMortgageExpirationDate"
    />
  </div>

  <!-- Button for adding new partitions -->
  <q-btn
    size="sm"
    color="primary"
    icon="add"
    round
    @click="addPartition"
  />
</template>

<script setup lang="ts">
import {IS_VALID_NUMBER} from 'src/data/RULES'
import {ref} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';

const emit = defineEmits(['change'])

const $q = useQuasar()

// Mortgage partitions
const mortgagePartitions = ref([
  {
    amount: null,
    date: null,
  }
])

/**
 * Adds a partition whenever the plus button is clicked
 * @returns {void}
 */
function addPartition(){
  mortgagePartitions.value.push(
    {
      amount: null,
      date: null,
    })
}

/**
 * Emits the updated value of the price, if it is valid
 * @returns {void}
 */
function emitPartitions() {
  emit('change', mortgagePartitions.value)
}

/**
 * Check whether the given mortgage expires at an invalid time
 * @param {string} expirationDateString - the expiration date to check as a string
 * @returns {void}
 */
function checkMortgageExpirationDate(expirationDateString: string){
  // TODO
  // TODO also emit...
  const expirationDate = new Date(expirationDateString)

  // Set up reference dates
  const dateInAMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
  const dateIn12Months = new Date(new Date().setMonth(new Date().getMonth() + 12))
  const dateIn24Months = new Date(new Date().setMonth(new Date().getMonth() + 24))

  // Warning case 1: <12 months in the future
  if(expirationDate.getTime() < dateInAMonth.getTime()){
    $q.dialog({
      component: WarningDialog,
      componentProps: {
        description: i18n.global.t('warnings.mortgage_too_short')
      }
    })
  }

  // Warning case 2: between 12 and 24 months in the future
  if(expirationDate.getTime() > dateIn12Months.getTime()  && expirationDate.getTime() < dateIn24Months.getTime()){
    $q.dialog({
      component: WarningDialog,
      componentProps: {
        description: i18n.global.t('warnings.mortgage_note')
      }
    })
  }
}

</script>
