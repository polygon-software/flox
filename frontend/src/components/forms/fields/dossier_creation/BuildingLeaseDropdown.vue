<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.building_lease') }}</strong>
    <q-option-group
      v-model="selectedOption"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="emitValue"
    />
  </div>
  <div v-if="selectedOption">
    <!-- Expiration date -->
    <q-input
      v-model="date"
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
      v-model.number="price"
      dense
      type="number"
      :label="$t('form_for_clients.building_lease_interest')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitValuePrice"
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

const selectedOption = ref(options[1].value)
const landlord = ref(landlordOptions[0].value)
const date = ref(new Date())
const price = ref(null)


/**
 * Checks the landlord type and warns if appropriate
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
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue() {
  emit('change', selectedOption)
}


/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitDate() {
  emit('change', date)
}

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValuePrice() {
  emit('change', price)
}
</script>
