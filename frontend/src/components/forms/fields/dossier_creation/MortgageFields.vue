<template>
  <div>

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
        @change="emitValue"
      ></q-input>
      <q-input
        v-model="partition.date"
        type="date"
        dense
        :label="$t('dossier.expiration_date')"
        @change="checkMortgageExpirationDate"
      />
    </div>

    <!-- Error message (if appropriate) -->
    <div
      v-if="!isValidTotal"
      class="row items-start"
      style="margin-top: 24px"
    >
      <q-icon name="error" color="negative" size="sm"/>
      <p
        class="text-negative q-ml-sm"
      >
        {{ $t('errors.mortgage_total_must_be', {amount: totalAmount})}}
      </p>
    </div>


    <!-- Button for adding new partitions -->
    <q-btn
      size="sm"
      color="primary"
      icon="add"
      :disable="mortgagePartitions.length >= maxPartitions"
      round
      @click="addPartition"
    />
  </div>
</template>

<script setup lang="ts">
import {IS_VALID_NUMBER, IS_VALID_YEAR} from 'src/data/RULES'
import {computed, onMounted, ref} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';

const emit = defineEmits(['change'])

const $q = useQuasar()

const props = defineProps({
  totalAmount: {
    type: Number,
    required: true,
  },
  initialValue: {
    type: Object,
    required: false,
    default: () => {
      return [{
        amount: null,
        date: null,
      }]
    }
  }
})

// Mortgage partitions
const mortgagePartitions = ref(props.initialValue as Record<string, unknown>[])

// Maximum number of partitions
const maxPartitions = 4

// On mount, preset initial partition to full value
onMounted(() => {
  mortgagePartitions.value[0].amount = props.totalAmount
})

/**
 * Whether the sum of all partition amounts is equal to the total amount
 */
const isValidTotal = computed(() => {
  let total = 0
  mortgagePartitions.value.forEach((partition) => total += parseInt(partition.amount))

  return total === parseInt(props.totalAmount);
})

/**
 * Adds a partition whenever the plus button is clicked
 * @returns {void}
 */
function addPartition(){
  if(mortgagePartitions.value.length < maxPartitions){
    mortgagePartitions.value.push(
      {
        amount: null,
        date: null,
    })
  }
}

/**
 * Emits the updated value of the price, if it is valid
 * @returns {void}
 */
function emitValue() {
  // TODO: if total not valid, emit as invalid?

  // Filter out nulls (if add button was pressed too often), except first partition
  const filteredPartitions = mortgagePartitions.value.filter((partition, index) => {
    return index === 0 || (partition.amount || partition.date)
  })
  emit('change', filteredPartitions)
}

/**
 * Check whether the given mortgage expires at an invalid time
 * @param {string} expirationDateString - the expiration date to check as a string
 * @returns {void}
 */
function checkMortgageExpirationDate(expirationDateString: string){
  const expirationDate = new Date(expirationDateString)

  // If year is invalid (e.g. while entering '2023', until fourth number is entered, year may be '023'), cancel
  if(!IS_VALID_YEAR(expirationDate.getFullYear())){
    return
  }

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
  if(expirationDate.getTime() > dateIn12Months.getTime() && expirationDate.getTime() < dateIn24Months.getTime()){
    $q.dialog({
      component: WarningDialog,
      componentProps: {
        description: i18n.global.t('warnings.mortgage_note')
      }
    })
  }

  // Emit value
  emitValue()
}

</script>
