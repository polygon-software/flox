<template>
  <div >
    <q-input
      v-model="date"
      mask="date"
      :rules="['date']"
      dense
      :label="props.label"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="date"
              @update:model-value="checkAgeLimit"
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
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
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

const date = ref(new Date())

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  emit('change', date)
}

/**
 * Warning Pop up if the birthdate is more than 60 years ago.
 * @param {Number} birthTimestamp - timestamp of the date of birth
 * @returns {void}
 */
function checkAgeLimit(birthTimestamp: number){
  if(props.retirementRule){
    const birthDate = new Date(birthTimestamp)
    if(calculateAge(birthDate) > 60){
      $q.dialog({
        component: WarningDialog,
        componentProps: {description: i18n.global.t('form_for_clients.retirement_warning')}
      })
    }
  }
}
</script>
