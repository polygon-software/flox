<template>
  <div >
    <q-input
      v-model="date"
      mask="date"
      :rules="['date']"
      dense
      :label="label"
      @update:model-value="dateInput"
    >
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="date"
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
import {useQuasar} from "quasar";
import WarningDialog from "components/dialogs/WarningDialog.vue";


const props = defineProps({
  label: {
    type: String,
    required: true,
  },
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

function dateInput(birth_date: Date){
  const date60yearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 60))
  // if(birth_date.getUTCFullYear() < date60yearsAgo.getUTCFullYear()){
  if(birth_date){
    $q.dialog({
      component: WarningDialog,
      componentProps: {description: i18n.global.t('form_for_clients.retirement_warning')}
    })
  }
}
</script>
