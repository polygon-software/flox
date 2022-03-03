<template>
  <q-dialog
    ref="dialogRef"
    :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 600px; min-height: 250px">
      <h5 style="text-align: center">{{ $t('buttons.custom_graph') }}</h5>
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <div style="display:flex; flex-direction: row">
          <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 10px">
            <p>{{ $t('dialog.period') }}</p>
            <q-radio v-model="period" style="color: #87858A" val="hours" :label="$t('dialog.hours')" />
            <q-radio v-model="period" style="color: #87858A" val="days" :label="$t('dialog.days')" />
            <q-radio v-model="period" style="color: #87858A" val="weeks" :label="$t('dialog.weeks')" />
            <q-radio v-model="period" style="color: #87858A" val="months" :label="$t('dialog.months')" />
            <q-radio v-model="period" style="color: #87858A" val="selected_period" >
              <q-input
                v-model="selectedPeriodText"
                outlined dense
                :label="$t('dialog.select_period')"
                mask="##.##.#### - ##.##.####">
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="selectedPeriod" range mask="DD.MM.YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-radio>
          </div>
          <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 35px; margin-right: 10px">
            <p>{{ $t('dialog.scale') }}</p>
            <q-radio v-model="scale" style="color: #87858A" val="perception_level" :label="$t('dialog.perception_level')" />
            <q-radio v-model="scale" style="color: #87858A" val="alarm_level" :label="$t('dialog.alarm_level')" />
            <q-radio v-model="scale" style="color: #87858A" val="highest_peak" :label="$t('dialog.highest_peak')" />
            <q-radio v-model="scale" style="color: #87858A" val="entered_value">
              <q-input v-model="enteredValue" outlined dense :label="$t('dialog.enter_value')" />
            </q-radio>
          </div>
        </div>
        <q-card-actions align="center">
          <q-btn
            :label="$t('buttons.show')"
            outline
            class="text-grey"
            type="submit"
          />
          <q-btn
            :label="$t('buttons.cancel')"
            outline
            class="text-grey"
            @click="onDialogCancel"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, defineEmits, ref} from 'vue';
import { useDialogPluginComponent } from 'quasar';

const period = ref('')
const scale = ref('')
const selectedPeriod = ref({ from: '02.08.2021', to: '17.08.2021' })
const enteredValue = ref('')

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const selectedPeriodText = computed({
  get: () => {
    return `${selectedPeriod.value.from} - ${selectedPeriod.value.to}`
  },
  set: (val: string) => {
    const stringArray: string[] = val.split('-')
    if (stringArray[0].trim() < stringArray[1].trim()) {
      throw new Error('Make sure that entering the date makes sense')
    }
    else if(stringArray.length > 1) {
      selectedPeriod.value = {from: stringArray[0].trim(), to: stringArray[1].trim()}
    }
  }
})

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  let periodValue = period.value
  let scaleValue = scale.value
  if(periodValue === 'selected_period'){
    periodValue = selectedPeriodText.value
  }
  if(scaleValue === 'entered_value'){
    scaleValue = enteredValue.value
  }
  onDialogOK({
    period: periodValue,
    scale: scaleValue,
  })
}
</script>
