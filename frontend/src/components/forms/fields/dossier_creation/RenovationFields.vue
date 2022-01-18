<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.renovation') }}</strong>

    <!-- Renovation toggle -->
    <q-option-group
      v-model="hasRenovation"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="emitType"
    />
  </div>
  <div v-if="hasRenovation">
    <!-- Renovation date -->
    <q-input
      v-model="renovationDate"
      type="date"
      :label="$t('form_for_clients.renovation_year')"
      @update:model-value="emitDate"
    />

    <!-- Renovation price -->
    <q-input
      v-model.number="renovationPrice"
      dense
      type="number"
      :label="$t('form_for_clients.renovation_amount')"
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

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

// Whether building was renovated
const hasRenovation = ref(options[1].value)

// Lease expiration date
const renovationDate = ref(new Date())

// Yearly lease interest
const renovationPrice = ref(null)

/**
 * Emits the building lease type
 * @returns {void}
 */
function emitType() {
  emit('change', hasRenovation.value)
}


/**
 * Emits the expiration date
 * @returns {void}
 */
function emitDate() {
  emit('change', renovationDate)
}

/**
 * Emits the yearly lease price
 * @returns {void}
 */
function emitLeaseInterest() {
  emit('change', renovationPrice.value)
}
</script>
