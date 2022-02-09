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
        :label="$t('form_for_clients.portion')+' '+ (index+1)"
        :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
        mask="###.###.###.###"
        reverse-fill-mask
        unmasked-value
        @update:model-value="emitValue"
      ></q-input>
      <q-input
        v-model="partition.date"
        type="date"
        dense
        :label="$t('dossier.expiration_date')"
        @update:model-value="checkMortgageExpirationDate"
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

    <!-- Button for adding new partitions (as long as all existing ones are valid) -->
    <q-btn
      size="sm"
      color="primary"
      icon="add"
      :disable="mortgagePartitions.length >= maxPartitions || !mortgagePartitions[mortgagePartitions.length-1].amount || !mortgagePartitions[mortgagePartitions.length-1].date"
      round
      @click="addPartition"
    />

    <!-- Button for removing last partition -->
    <q-btn
      class="q-ml-sm"
      size="sm"
      color="primary"
      icon="remove"
      :disable="mortgagePartitions.length === 1"
      round
      @click="removePartition"
    />
  </div>
</template>

<script setup lang="ts">
import {IS_VALID_NUMBER, IS_VALID_YEAR} from 'src/data/RULES'
import {computed, onMounted, ref} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';
import {DOSSIER_WARNING} from '../../../../../definitions/ENUMS';

const emit = defineEmits(['change', 'warning', 'no-warning'])
const $q = useQuasar()

const popupOpen = ref(false)

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

// On mount, preset initial partition to full value if no initial value is given
onMounted(() => {
  if(!mortgagePartitions.value[0].amount){
    mortgagePartitions.value[0].amount = props.totalAmount
  }
})

/**
 * Whether the sum of all partition amounts is equal to the total amount
 */
const isValidTotal = computed(() => {
  let total = 0
  mortgagePartitions.value.forEach((partition) => {
    if(partition.amount){
      total += parseInt(partition.amount)
    }
  })


  return total === parseInt(props.totalAmount);
})

/**
 * Adds a mortgage partition
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
 * Removes the last partition
 * @returns {void}
 */
function removePartition(){
  if(mortgagePartitions.value.length > 1){
    mortgagePartitions.value.pop()
  }
}

/**
 * Emits the updated value of the price, if it is valid
 * @returns {void}
 */
function emitValue() {

  // If total amount is not valid, don't emit
  if(!isValidTotal.value){
    emit('change', null)
    return
  }

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
    if(!popupOpen.value){
      popupOpen.value = true
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: i18n.global.t('warnings.mortgage_too_short')
        }
      }).onDismiss(() => {
        popupOpen.value = false
      })

      // Emit warning to mark as non-arrangeable
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      emit('warning', DOSSIER_WARNING.MORTGAGE_DURATION)
    }
  }
  // Warning case 2: between 12 and 24 months in the future
  else if(expirationDate.getTime() > dateIn12Months.getTime() && expirationDate.getTime() < dateIn24Months.getTime()){
    if(!popupOpen.value){
      popupOpen.value = true
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: i18n.global.t('warnings.mortgage_note')
        }
      }).onDismiss(() => {
        popupOpen.value = false
      })

      // Emit warning to mark as non-arrangeable
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      emit('warning', DOSSIER_WARNING.MORTGAGE_DURATION)
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    emit('no-warning', DOSSIER_WARNING.MORTGAGE_DURATION)
  }

  // Emit value
  emitValue()
}

</script>
