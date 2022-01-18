<template>
  <q-input
    v-model="date"
    :rules="['date']"
    type="date"
    dense
    :label="props.label"
    @update:model-value="emitValue"
  />
</template>

<script setup lang="ts">
import {defineProps, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {useQuasar} from 'quasar';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {calculateAge} from 'src/helpers/date-helpers';


const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  retirementRule: {
    type: Boolean,
    required: false,
    default: false,
  }
})
const emit = defineEmits(['change'])
const $q = useQuasar()

const date = ref(null)

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
  if(props.retirementRule && calculateAge(birthdate) > 60 && !popupOpen.value){
    popupOpen.value = true
    $q.dialog({
      component: WarningDialog,
      componentProps: {
        description: i18n.global.t('warnings.retirement_warning')
      }
    }).onDismiss(() => {
      popupOpen.value = false
    })
  }
}
</script>
