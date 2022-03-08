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
            <q-radio v-model="periodOption" style="color: #87858A" val="twelve_hours" :label="$t('dialog.hours')" />
            <q-radio v-model="periodOption" style="color: #87858A" val="two_days" :label="$t('dialog.days')" />
            <q-radio v-model="periodOption" style="color: #87858A" val="two_weeks" :label="$t('dialog.weeks')" />
            <q-radio v-model="periodOption" style="color: #87858A" val="one_month" :label="$t('dialog.months')" />
            <q-radio v-model="periodOption" style="color: #87858A" val="custom" >
              <q-input
                v-model="customPeriodText"
                outlined
                dense
                :label="$t('dialog.select_period')"
                mask="##.##.####-##.##.####"
                :rules="[() => checkDate() || $t('errors.incorrect_date_range')]"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="customPeriodValue" range :mask="dateFormat">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label="$t('buttons.close')" color="primary" flat />
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
            <q-radio v-model="scaleOption" style="color: #87858A" val="highest_peak" :label="$t('dialog.highest_peak')" />
            <q-radio v-model="scaleOption" style="color: #87858A" val="perception_level" :label="$t('dialog.perception_level')" />
            <q-radio v-model="scaleOption" style="color: #87858A" val="alarm_level" :label="$t('dialog.alarm_level')" />
            <q-radio v-model="scaleOption" style="color: #87858A" val="custom">
              <q-input
                v-model.number="customScaleValue"
                outlined dense
                :label="$t('dialog.enter_value')"
                :rules="[val => parseFloat(val) || $t('errors.incorrect_number')]"
              />
            </q-radio>
          </div>
        </div>
        <q-card-actions align="center">
          <q-btn
            :label="$t('buttons.show')"
            outline
            class="text-grey"
            type="submit"
            :disable="checkDate"
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
import {computed, ref, defineProps, Ref} from 'vue';
import {date, useDialogPluginComponent} from 'quasar';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  scale: {
    type: String,
    required: false,
    default: 'highest_peak',
  },
  period: {
    type: String,
    required: false,
    default: 'twelve_hours',
  },
  customScale: {
    type: Number,
    required: false,
    default: 1.0,
  },
  customPeriod: {
    type: Object,
    required: false,
    default: null,
  },
})

const dateFormat = 'DD.MM.YYYY'

const periodOption = ref(props.period)
const scaleOption = ref(props.scale)
const customPeriodValue: Ref<Record<string, string>|string> = ref({
  from: date.formatDate(props.customPeriod?.start as Date ?? new Date(), dateFormat),
  to: date.formatDate(props.customPeriod?.end as Date ?? new Date(), dateFormat),
})
const customScaleValue = ref(props.customScale)

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const customPeriodText = computed({
  get: () => {
    const valueObject = customPeriodValue.value as Record<string, string>
    const valueString = customPeriodValue.value as string
    return valueObject.from ? `${valueObject.from}-${valueObject.to}` : `${valueString}-${valueString}` ?? ''
  },
  set: (val: string) => {
    const stringArray: string[] = val.split('-')
    if(stringArray.length === 2) {
      const start = stringArray[0].trim()
      const end = stringArray[1].trim()
      customPeriodValue.value = start === end ? start : {from: start, to: end}
    }
  }
})

/**
 * Checks the date range, if from date is before to date
 * @returns {void}
 */
function checkDate() {
  const valueObject = customPeriodValue.value as Record<string, string>
  return valueObject.from ? date.extractDate(valueObject.from, dateFormat) <= date.extractDate(valueObject.to, dateFormat) : true
}

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  const periodOptionValue: string = periodOption.value
  const customPeriodTextValue = periodOptionValue === 'custom' ? customPeriodText.value : ''
  const scaleOptionValue: string = scaleOption.value
  const customScaleValueValue = scaleOptionValue === 'custom' ? customScaleValue.value.toString() : ''
  onDialogOK({
    period: periodOptionValue,
    scale: scaleOptionValue,
    customPeriod: customPeriodTextValue,
    customScale: customScaleValueValue,
  })
}
</script>
