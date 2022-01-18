<template>
  <div class="row q-mb-md">
    <strong class="col q-py-sm">{{ $t('form_for_clients.amortisation') }}</strong>

    <!-- Amortisation toggle -->
    <q-option-group
      v-model="hasAmortisation"
      class="col"
      :options="options"
      type="radio"
      inline
      @update:model-value="resetValues"
    />
  </div>
  <!-- Amortisation info (if applicable) -->
  <div v-if="hasAmortisation">
    <!-- Amortisation type -->
    <q-option-group
      v-model="directAmortisation"
      class="col"
      :options="typeOptions"
      type="radio"
      inline
      @update:model-value="emitValue"
    />

    <!-- Amortisation amount -->
    <q-input
      v-model.number="amortisationAmount"
      dense
      type="number"
      :label="$t('form_for_clients.amount')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitValue"
    />
  </div>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {ref,} from 'vue';
import {IS_VALID_NUMBER, IS_VALID_YEAR} from 'src/data/RULES';

const emit = defineEmits(['change'])

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const typeOptions = [
  {label: i18n.global.t('form_for_clients.direct'), value: true},
  {label: i18n.global.t('form_for_clients.indirect'), value: false},
]

// Whether amortisation is present
const hasAmortisation = ref(options[1].value)

// Whether amortisation is direct
const directAmortisation = ref(true)

// Amortisation amount
const amortisationAmount = ref(null)

/**
 * Emits the amortisation information
 * @returns {void}
 */
function emitValue() {
  emit('change', {
    hasAmortisation: hasAmortisation.value,
    directAmortisation: directAmortisation.value,
    amortisationAmount: amortisationAmount.value
  })
}

/**
 * Resets renovation info (triggered upon section toggle)
 * @returns {void}
 */
function resetValues(){
  directAmortisation.value = true
  amortisationAmount.value = null

  // Emit new value
  emitValue()
}

</script>
