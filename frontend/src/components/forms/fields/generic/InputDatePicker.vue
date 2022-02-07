<template>
  <!-- Wrapper div to prevent q-input events from reaching form -->
  <div>
    <q-input
      v-model="date"
      :rules="props.rules"
      type="date"
      dense
      :label="props.label"
      @update:model-value="emitValue"
    />
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {calculateAge, dateToInputString} from 'src/helpers/date-helpers';
import {IS_VALID_DATE} from 'src/data/RULES';
import {DOSSIER_WARNING} from '../../../../../definitions/ENUMS';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  retirementRule: {
    type: Boolean,
    required: false,
    default: false,
  },
  rules: {
    type: Array,
    required: false,
    default: () => [(val: Date): boolean|string => IS_VALID_DATE(val) || i18n.global.t('errors.invalid_date')]
  },
  initialValue: {
    type: Date,
    required: false,
    default: null
  }
})

const emit = defineEmits(['change', 'warning', 'no-warning'])
const $q = useQuasar()

const date = ref(dateToInputString(props.initialValue)  ?? null)

// Whether the warning popup is open
const popupOpen = ref(false)

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  if(date.value){
    const asDate = new Date(date.value)

    // Ensure date input is finished (e.g. user is not still manually typing)
    if(asDate.getFullYear() > 1900){
      // Check for age limit
      checkAgeLimit(asDate)
    }
    emit('change', asDate)
  }
}

/**
 * Warning Pop up if the birthdate is more than 60 years ago.
 * @param {Date} birthdate - date of birth
 * @returns {void}
 */
function checkAgeLimit(birthdate: Date){
  if(props.retirementRule && calculateAge(birthdate) > 60) {
    if (!popupOpen.value) {
      popupOpen.value = true
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: i18n.global.t('warnings.retirement_warning')
        }
      }).onDismiss(() => {
        popupOpen.value = false
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      emit('warning', DOSSIER_WARNING.RETIREMENT)
    }
  } else if(props.retirementRule) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    emit('no-warning', DOSSIER_WARNING.RETIREMENT)
  }
}
</script>
