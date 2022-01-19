<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.building_lease') }}</strong>
    <q-option-group
      v-model="hasBuildingLease"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="resetValues"
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
        v-model="publicLandlord"
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
      @change="emitValue"
    />
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {onMounted, ref,} from 'vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {useQuasar} from 'quasar';
import {IS_VALID_NUMBER, IS_VALID_YEAR} from 'src/data/RULES';

const emit = defineEmits(['change'])
const $q = useQuasar()

const props = defineProps({
  initialValue: {
    type: Object,
    required: false,
    default: () => {
      return {
        hasBuildingLease: false,
        publicLandlord: true,
        expirationDate: null,
        interest: null,
      }
    }
  }
})

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const landlordOptions = [
  {label: i18n.global.t('form_for_clients.public'), value: true},
  {label: i18n.global.t('form_for_clients.private'), value: false},
]

// Whether building lease applies
const hasBuildingLease = ref(props.initialValue?.hasBuildingLease as boolean)

// Landlord type (public/private)
const publicLandlord = ref(props.initialValue?.publicLandlord as boolean)

// Lease expiration date
const expirationDate = ref(props.initialValue?.expirationDate as Date ?? null)

// Yearly lease interest
const interest = ref(props.initialValue?.interest as number ?? null)

// Whether the warning popup is open
const popupOpen = ref(false)

onMounted(() => {
  // Emit initial value (simply set to "No"), since it's already a valid input
  emitValue()
})

/**
 * Resets building lease info (triggered upon section toggle)
 * @returns {void}
 */
function resetValues(){
  publicLandlord.value = landlordOptions[0].value
  interest.value = null
  expirationDate.value = null

  // Emit new value
  emitValue()
}

/**
 * Checks the landlord type and warns if necessary
 * @param {Boolean} isPublic - landlord type
 * @returns {void}
 */
function checkLandlordType(isPublic: boolean){
  if(!isPublic && !popupOpen.value){
    popupOpen.value = true
    $q.dialog({
      component: WarningDialog,
      componentProps: {description:  i18n.global.t('warnings.warning_landlord') }}
    ).onDismiss(() => popupOpen.value = false)
  }

  // Emit new value
  emitValue()
}

/**
 * Checks building permit expiration date and warns if necessary
 * @param {string} expirationDateString - expiration date as string
 * @returns {void}
 */
function checkExpirationDate(expirationDateString: string){
  const expirationDate = new Date(expirationDateString)

  if(!IS_VALID_YEAR(expirationDate.getFullYear())){
    return
  }

  const dateIn70Years: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 70))

  if(expirationDate.getTime() < dateIn70Years.getTime() && !popupOpen.value ){
    popupOpen.value = true
    $q.dialog({
      component: WarningDialog,
      componentProps: {description:  i18n.global.t('warnings.building_lease_warning') }}
    ).onDismiss(() => popupOpen.value = false)
  }

  // Emit new value
  emitValue()
}

/**
 * Emits the building lease information
 * @returns {void}
 */
function emitValue() {
  emit('change', {
    hasBuildingLease: hasBuildingLease.value,
    publicLandlord: publicLandlord.value,
    expirationDate: expirationDate.value,
    interest: interest.value
  })
}
</script>
