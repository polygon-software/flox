<template>
  <div>
    <div class="row flex flex-center">
      <div style="width: 250px">
        <p>{{ $t('edit_parameters.name') }}</p>
        <q-input
          v-model="name"
          outlined
          :label="props.fullName"
          :disable="props.disabled"
          dense
          type="text"
          lazy-rules="true"
          :rules="[(val) => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_username')]"
        />
        <p>{{ $t('edit_parameters.number') }}</p>
        <q-input
          v-model="phone"
          outlined
          prefix="+41"
          :label="props.phoneNumber"
          :disable="props.disabled"
          dense
          type="tel"
          lazy-rules="ondemand"
          mask="## ### ## ##"
          :rules="[(val) => IS_VALID_STRING(val) || i18n.global.t('errors.invalid_phone_number')]"
        />
        <p>{{ $t('edit_parameters.email') }}</p>
        <q-input
          v-model="email"
          outlined
          :label="props.emailAddress"
          :disable="props.disabled"
          dense
          type="email"
          lazy-rules="ondemand"
          :rules="[(val) => IS_EMAIL(val) || i18n.global.t('errors.invalid_email')]"
        />
      </div>
      <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 35px; color: #87858A">
        <q-checkbox
          v-for="checkbox in checkboxes"
          :key="checkbox.val"
          v-model="selection"
          :val="checkbox.val"
          :label="checkbox.label"
          :disable="props.disabled"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref, defineExpose, PropType} from 'vue';
import {i18n} from 'boot/i18n';
import { IS_VALID_STRING, IS_EMAIL } from 'src/data/RULES'
import {DeviceContact} from 'src/data/types/DeviceContact';

const checkboxes = [
  {val: 'event', label: i18n.global.t('edit_parameters.event'),},
  {val: 'alarm1', label: i18n.global.t('edit_parameters.alarm1')},
  {val: 'alarm2', label: i18n.global.t('edit_parameters.alarm2')},
  {val: 'smsLimit', label: i18n.global.t('edit_parameters.sms_limit')},
  {val: 'power', label: i18n.global.t('edit_parameters.battery')},
  {val: 'memory', label: i18n.global.t('edit_parameters.memory')},
  {val: 'daily', label: i18n.global.t('edit_parameters.daily')},
]

const props = defineProps({
  contact: {
    required: false,
    type: Object as PropType<DeviceContact>,
    default: null,
  },
  // Whether input is disabled
  disabled: {
    required: true,
    type: Boolean,
  },
})

const name = ref(props.contact?.name ?? '')
const phone = ref(props.contact?.phone ?? '')
const email = ref(props.contact?.email ?? '')
const selection = ref(buildPreSelection())

/**
 * Builds array of preselected values, depending on prop input
 * @returns {string[]} - selected alarms
 */
function buildPreSelection(){
  if(!props.contact){
    return []
  }

  const preSelection: string[] = []
  const possibleKeys = ['event', 'alarm1', 'alarm2', 'smsLimit', 'power', 'memory', 'daily']

  possibleKeys.forEach((key: string) => {
    if(props.contact[key]){
      preSelection.push(key)
    }
  })

  return preSelection
}

/**
 * Return the entered and selected values of this form
 * @returns {object} - object which contains all values
 */
function getData(): Record<string, unknown>{
  return {
    name: name.value,
    phone: '+41 ' + phone.value,
    email: email.value,
    selection: selection.value
  }
}

defineExpose({getData})

</script>

<style scoped>
  p{
    color: #87858A;
    margin-top: 25px;
    margin-bottom: 0
  }
</style>
