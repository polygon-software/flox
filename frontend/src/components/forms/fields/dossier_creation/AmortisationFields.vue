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

  <q-card
    v-if="hasAmortisation"
    class="q-pa-sm bg-grey-1"
    style="margin-bottom: 24px"
  >    <!-- Amortisation type -->
    <div class="row q-mb-md">
      <strong class="col q-py-sm">{{ $t('form_for_clients.type') }}</strong>
      <q-option-group
        v-model="directAmortisation"
        class="col"
        :options="typeOptions"
        type="radio"
        inline
        @update:model-value="emitValue"
      />
    </div>

    <!-- Amortisation amount -->
    <q-input
      v-model.number="amortisationAmount"
      dense
      :label="$t('form_for_clients.amount')"
      :rules="[(val) => IS_VALID_NUMBER(val) || $t('errors.invalid_amount')]"
      @change="emitValue"
      mask="###.###.###.###"
      reverse-fill-mask
      unmasked-value
    />
  </q-card>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {onMounted, ref,} from 'vue';
import {IS_VALID_NUMBER} from 'src/data/RULES';

const emit = defineEmits(['change'])

const props = defineProps({
  initialValue: {
    type: Object,
    required: false,
    default: () => {
      return {
        hasAmortisation: false,
        directAmortisation: true,
        amortisationAmount: null,
      }
    }
  }
})

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

const typeOptions = [
  {label: i18n.global.t('form_for_clients.direct'), value: true},
  {label: i18n.global.t('form_for_clients.indirect'), value: false},
]

// Whether amortisation is present
const hasAmortisation = ref(props.initialValue?.hasAmortisation as boolean)

// Whether amortisation is direct
const directAmortisation = ref(props.initialValue?.directAmortisation as boolean)

// Amortisation amount
const amortisationAmount = ref(props.initialValue?.amortisationAmount as number|null)

onMounted(() => {
  // Emit initial value (simply set to "No"), since it's already a valid input
  emitValue()
})

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
