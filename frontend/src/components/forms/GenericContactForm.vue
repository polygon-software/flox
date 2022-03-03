<template>
  <div>
    <div style="display:flex; flex-direction: row">
      <div style="width: 250px">
        <p>{{ $t('edit_parameters.name') }}</p>
        <q-input
          v-model="name"
          outlined
          :label="props.fullName"
          :disable="props.disabled"
        />
        <p>{{ $t('edit_parameters.number') }}</p>
        <q-input
          v-model="phone"
          type="number"
          outlined
          prefix="+41"
          :label="props.phoneNumber"
          :disable="props.disabled"
        />
        <p>{{ $t('edit_parameters.email') }}</p>
        <q-input
          v-model="email"
          type="email"
          outlined
          :label="props.emailAddress"
          :disable="props.disabled"
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
import {defineProps, ref, defineExpose} from 'vue';

const name = ref('')
const phone = ref('')
const email = ref('')
const selection = ref([])

const checkboxes = [
  {val: 'event', label: 'Event'},
  {val: 'alarm1', label: 'Alarm 1'},
  {val: 'alarm2', label: 'Alarm 2'},
  {val: 'sms', label: 'SMS limit'},
  {val: 'power_battery', label: 'Power/Battery'},
  {val: 'memory', label: 'Memory'},
  {val: 'daily', label: 'Daily'},
]

const props = defineProps({
  fullName: {
    required: false,
    type: String,
    default: '',
  },
  phoneNumber: {
    required: false,
    type: String,
    default: '',
  },
  emailAddress: {
    required: false,
    type: String,
    default: '',
  },
  disabled: {
    required: true,
    type: Boolean,
  },
})

/**
 * Return the entered and selected values of this form
 * @returns {object} - object which contains all values
 */
function getData(): Record<string, unknown>{
  return {fullName: name.value, phoneNumber: phone.value, emailAddress: email.value, selection: selection.value}
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
