<template>
  <div
  v-for="(tranche, index) in mortgage_tranches"
  v-bind:key="tranche.text">
    <q-input
      v-model="tranche.portion"
      dense
      type="text"
      :label="$t('form_for_clients.portion')+' '+ (index+1)"
      :rules="[(val: string) => IS_VALID_STRING(val) || $t('errors.invalid_amount')]"
      @change="emitValuePortion"
    ></q-input>
    <q-input
      v-model="tranche.date"
      mask="date"
      :rules="['date']"
      dense
      :label="$t('dossier.expiration_date')"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="tranche.date"
              @update:model-value="checkMortgageExpirationDate"
              @change="emitValue"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
  <q-btn round size="sm" color="primary" icon="add" @click="addTranche"/>
</template>

<script setup lang="ts">
import {IS_VALID_STRING} from 'src/data/RULES'
import {computed, ref} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';

const emit = defineEmits(['change'])
const date = ref(new Date())

const portion = ref('')
const $q = useQuasar()
// const mortgage_tranches = [{portion: ref(portion), date: ref(date)}]
/**
 * Keeps mortgage_tranches up to date
 * @returns {Array}
 */
const mortgage_tranches = computed(()=>  {
  return [{portion: ref(portion), date: ref(date)}]
})

/**
 * Adds a tranche whenever the plus button is clicked
 * @returns {void}
 */
function addTranche(){
  mortgage_tranches.value.push({portion: ref(''), date: ref(new Date())})
  console.log(mortgage_tranches.value)
}

/**
 * Emits the updated value of the price, if it is valid
 * @returns {void}
 */
function emitValuePortion() { // TODO: emit the whole array somehow
  emit('change', portion)
}

/**
 * Warning Pop up if the birthdate is more than 60 years ago.
 * @param {Number} birthTimestamp - timestamp of the date of birth
 * @returns {void}
 */
function checkMortgageExpirationDate(birthTimestamp: number){
  const date1 = new Date(birthTimestamp)
  const dateInAMonth = new Date(new Date().setMonth(new Date().getMonth() + 1))
  const dateIn12Months = new Date(new Date().setMonth(new Date().getMonth() + 12))
  const dateIn24Months = new Date(new Date().setMonth(new Date().getMonth() + 24))
    if(date1.getTime() > dateInAMonth.getTime()){
      $q.dialog({
        component: WarningDialog,
        componentProps: {description: i18n.global.t('form_for_clients.warning_too_short')}
      })
    }
    if(date1.getTime() > dateIn12Months.getTime()  && date1.getTime() < dateIn24Months.getTime()){
      $q.dialog({
        component: WarningDialog,
        componentProps: {description: i18n.global.t('form_for_clients.warning_mortgage_note')}
      })
    }
}

</script>
