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
            <q-radio style="color: #87858A" v-model="period" val="hours" :label="$t('dialog.hours')" />
            <q-radio style="color: #87858A" v-model="period" val="days" :label="$t('dialog.days')" />
            <q-radio style="color: #87858A" v-model="period" val="weeks" :label="$t('dialog.weeks')" />
            <q-radio style="color: #87858A" v-model="period" val="months" :label="$t('dialog.months')" />
            <q-radio style="color: #87858A" v-model="period" val="selected_period" >
              <q-input outlined v-model="selectedPeriod" :label="$t('dialog.select_period')">
                <template v-slot:append>
                  <!-- TODO clicking on icon open q-date -->
                  <q-icon name="event"/>
                </template>
              </q-input>
            </q-radio>
          </div>
          <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 35px; margin-right: 10px">
            <p>{{ $t('dialog.scale') }}</p>
            <q-radio style="color: #87858A" v-model="scale" val="perception_level" :label="$t('dialog.perception_level')" />
            <q-radio style="color: #87858A" v-model="scale" val="alarm_level" :label="$t('dialog.alarm_level')" />
            <q-radio style="color: #87858A" v-model="scale" val="highest_peak" :label="$t('dialog.highest_peak')" />
            <q-radio style="color: #87858A" v-model="scale" val="enter_value">
              <q-input outlined v-model="enterValue" :label="$t('dialog.enter_value')" />
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
import {defineEmits, ref} from 'vue';
import { useDialogPluginComponent } from 'quasar';

const period = ref('')
const scale = ref('')
const selectedPeriod = ref('')
const enterValue = ref('')

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  onDialogOK({
    period: period.value,
    scale: scale.value,
  })
}
</script>
