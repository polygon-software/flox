<template>
  <div
  v-for="(partition, index) in mortgagePartitions"
  :key="`partition_${index}`">
    <q-input
      v-model="partition.amount"
      dense
      type="text"
      :label="$t('form_for_clients.portion')+' '+ (index+1)"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitPartitions"
    ></q-input>
    <q-input
      v-model="partition.date"
      type="date"
      :rules="['date']"
      dense
      :label="$t('dossier.expiration_date')"
      @change="checkMortgageExpirationDate"
    />
  </div>
  <q-btn round size="sm" color="primary" icon="add" @click="addPartition"/>
</template>

<script setup lang="ts">
import {IS_VALID_STRING} from 'src/data/RULES'
import {computed, ref} from 'vue';
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
  // TODO also emit...
  const expirationDate = new Date(expirationDateString)

  console.log('check for date', expirationDate)

  const dateInAMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
  const dateIn12Months = new Date(new Date().setMonth(new Date().getMonth() + 12))
  const dateIn24Months = new Date(new Date().setMonth(new Date().getMonth() + 24))
    if(expirationDate.getTime() < dateInAMonth.getTime()){
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: i18n.global.t('warnings.warning_too_short')
        }
      })
    }
    if(expirationDate.getTime() > dateIn12Months.getTime()  && expirationDate.getTime() < dateIn24Months.getTime()){
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: i18n.global.t('warnings.warning_mortgage_note')
        }
      })
    }
}

</script>
