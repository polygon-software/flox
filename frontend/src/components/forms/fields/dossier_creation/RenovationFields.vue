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
      @update:model-value="resetValues"
    />
  </div>
  <!-- Renovation info (if applicable) -->
  <div v-if="hasRenovation">
    <!-- Renovation date -->
    <q-input
      v-model.number="renovationYear"
      type="number"
      :label="$t('form_for_clients.renovation_year')"
      :rules="[(val) => IS_VALID_PAST_YEAR(val) || $t('errors.invalid_year')]"
      @update:model-value="emitValue"
    />

    <!-- Renovation price -->
    <q-input
      v-model.number="renovationPrice"
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
import {onMounted, ref,} from 'vue';
import {IS_VALID_NUMBER, IS_VALID_PAST_YEAR} from 'src/data/RULES';

const emit = defineEmits(['change'])

const props = defineProps({
  initialValue: {
    type: Object,
    required: false,
    default: () => {
      return {
        hasRenovation: false,
        renovationYear: null,
        renovationPrice: null,
      }
    }
  }
})

const options = [
  {label: i18n.global.t('general.yes'), value: true},
  {label: i18n.global.t('general.no'), value: false},
]

// Whether building was renovated
const hasRenovation = ref(props.initialValue?.hasRenovation as boolean)

// Lease expiration date
const renovationYear = ref(props.initialValue?.renovationYear as number|null)

// Yearly lease interest
const renovationPrice = ref(props.initialValue?.renovationPrice as number|null)


onMounted(() => {
  // Emit initial value (simply set to "No"), since it's already a valid input
  emitValue()
})

/**
 * Emits the renovation information
 * @returns {void}
 */
function emitValue() {
  emit('change', {
    hasRenovation: hasRenovation.value,
    renovationYear: renovationYear.value,
    renovationPrice: renovationPrice.value
  })
}

/**
 * Resets renovation info (triggered upon section toggle)
 * @returns {void}
 */
function resetValues(){
  renovationPrice.value = null
  renovationYear.value = null

  // Emit new value
  emitValue()
}

</script>
