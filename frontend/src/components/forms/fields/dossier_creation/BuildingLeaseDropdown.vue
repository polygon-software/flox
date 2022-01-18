<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.building_lease') }}</strong>
    <q-option-group
      v-model="hasBuildingLease"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="emitType"
    />
  </div>
  <div v-if="hasBuildingLease">
    <!-- Expiration date -->
    <q-input
      v-model="expirationDate"
      type="date"
      :label="$t('form_for_clients.expiration_date')"
      @update:model-value="checkExpirationDate"
    />

    <!-- Landlord type -->
    <div class="row q-mb-md">
      <p class="col q-py-sm">{{ $t('form_for_clients.landlord') }}</p>
      <q-option-group
        v-model="landlord"
        class="col"
        :options="landlordOptions"
        type="radio"
        inline
        @update:model-value="checkLandlordType"
      />
    </div>

    <!-- Lease interest rate -->
    <q-input
      v-model.number="interest"
      dense
      type="number"
      :label="$t('form_for_clients.building_lease_interest')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitLeaseInterest"
    />
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {ref,} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {useQuasar} from 'quasar';
import {IS_VALID_NUMBER} from 'src/data/RULES';

const emit = defineEmits(['change'])
const $q = useQuasar()

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const landlordOptions = [
  {label: i18n.global.t('form_for_clients.public'), value: true},
  {label: i18n.global.t('form_for_clients.private'), value: false},
]

// Whether building lease applies
const hasBuildingLease = ref(options[1].value)

// Landlord type (public/private)
const landlord = ref(landlordOptions[0].value)

// Lease expiration date
const expirationDate = ref(new Date())

// Yearly lease interest
const interest = ref(null)

/**
 * Checks the landlord type and warns if necessary
 * @param {Boolean} isPublic - landlord type
 * @returns {void}
 */
function checkLandlordType(isPublic: boolean){
  if(!isPublic){
    $q.dialog({
      component: WarningDialog,
      componentProps: {description:  i18n.global.t('warnings.warning_landlord') }}
      )
  }
}

/**
 * Checks building permit expiration date and warns if necessary
 * @param {string} expirationDateString - expiration date as string
 * @returns {void}
 */
function checkExpirationDate(expirationDateString: string){
  const expirationDate = new Date(expirationDateString)
  const dateIn70Years: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 70))

  if(expirationDate.getTime() < dateIn70Years.getTime() ){
    $q.dialog({
      component: WarningDialog,
      componentProps: {description:  i18n.global.t('warnings.building_lease_warning') }}
      )
  }
}

/**
 * Emits the building lease type
 * @returns {void}
 */
function emitType() {
  emit('change', hasBuildingLease.value)
}


/**
 * Emits the expiration date
 * @returns {void}
 */
function emitDate() {
  emit('change', expirationDate)
}

/**
 * Emits the yearly lease price
 * @returns {void}
 */
function emitLeaseInterest() {
  emit('change', interest.value)
}
</script>
