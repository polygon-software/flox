<template>
  <div class="row q-pa-xl items-center">
    <!-- Edit/delete Button row (only for prefilled forms) -->
    <div
      v-if="contact"
      class="full-width row justify-end"
    >
      <!-- Delete button (if editing) -->
      <q-btn
        v-if="isEditing"
        icon="delete"
        text-color="negative"
        size="sm"
        unelevated
        round
        @click="onDelete"
      />
      <!-- Save button (if editing) -->
      <q-btn
        v-if="isEditing"
        icon="save"
        text-color="positive"
        size="sm"
        unelevated
        round
        @click="onSave"
      />

      <!-- Edit button (if not editing) -->
      <q-btn
        :icon="isEditing ? 'close' : 'edit'"
        text-color="primary"
        size="sm"
        unelevated
        round
        @click="toggleEditing"
      />
    </div>
    <!-- Left column: basic info -->
    <div class="column full-height">
        <p>{{ $t('edit_parameters.name') }}</p>
        <q-input
          v-model="name"
          outlined
          :disable="!isEditing"
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
          :disable="!isEditing"
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
          :disable="!isEditing"
          dense
          type="email"
          lazy-rules="ondemand"
          :rules="[(val) => IS_EMAIL(val) || i18n.global.t('errors.invalid_email')]"
        />
      </div>

    <!-- Right column: selected toggles -->
    <div
      class="column full-height justify-between"
      style="margin-left: 35px"
    >
      <q-checkbox
        v-for="checkbox in checkboxes"
        :key="checkbox.val"
        v-model="selection"
        :val="checkbox.val"
        :label="checkbox.label"
        :disable="!isEditing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref, defineExpose, PropType} from 'vue';
import {i18n} from 'boot/i18n';
import { IS_VALID_STRING, IS_EMAIL } from 'src/data/RULES'
import {DeviceContact} from 'src/data/types/DeviceContact';
import {useQuasar} from 'quasar';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {EDIT_CONTACT} from 'src/data/mutations/DEVICE';
import {showNotification} from 'src/helpers/notification-helpers';
import {deviceType} from 'src/helpers/device-helpers';

const $q = useQuasar()

const props = defineProps({
  // Contact whose info to pre-fill (if any)
  contact: {
    required: false,
    type: Object as PropType<DeviceContact>,
    default: null,
  },
  // Whether input is disabled
  disabled: {
    required: false,
    type: Boolean,
    default: false
  },
  // Device CLI
  cli: {
    required: false,
    type: String,
    default: null
  },
})

const checkboxes = deviceType(props.cli) === 'MR2000' ? [
  {val: 'event', label: i18n.global.t('edit_parameters.event'),},
  {val: 'alarm1', label: i18n.global.t('edit_parameters.alarm1')},
  {val: 'alarm2', label: i18n.global.t('edit_parameters.alarm2')},
  {val: 'smsLimit', label: i18n.global.t('edit_parameters.sms_limit')},
  {val: 'power', label: i18n.global.t('edit_parameters.battery')},
  {val: 'daily', label: i18n.global.t('edit_parameters.daily')},
] : [
  {val: 'event', label: i18n.global.t('edit_parameters.event'),},
  {val: 'alarm1', label: i18n.global.t('edit_parameters.alarm1')},
  {val: 'alarm2', label: i18n.global.t('edit_parameters.alarm2')},
  {val: 'smsLimit', label: i18n.global.t('edit_parameters.sms_limit')},
  {val: 'power', label: i18n.global.t('edit_parameters.battery')},
  {val: 'memory', label: i18n.global.t('edit_parameters.memory')},
  {val: 'daily', label: i18n.global.t('edit_parameters.daily')},
]
// Form values
const name = ref(props.contact?.name ?? '')
const phone = ref(props.contact?.phone.substring(3) ?? '') // Remove prefix, since it is added again by QInput
const email = ref(props.contact?.email ?? '')
const selection = ref(buildPreSelection())

// Editing status (false if a pre-fill value if given, then edit must be enabled manually)
const isEditing = ref(!props.contact)

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

/**
 * Toggles editing and, if disabling, resets to default pre-fill values
 * @returns {void}
 */
function toggleEditing() {
  // If currently editing, reset to default data (discard changes)
  if(isEditing.value){
    name.value = props.contact?.name ?? ''
    phone.value = props.contact?.phone.substring(3) ?? ''
    email.value = props.contact?.email ?? ''
    selection.value =buildPreSelection()
  }

  // Toggle value
  isEditing.value = !isEditing.value
}

/**
 * Shows a deletion prompt dialog
 * @returns {void}
 */
function onDelete(){
  $q.dialog({
    component: WarningDialog,
    componentProps: {
      description: i18n.global.t('warnings.delete_contact'),
      showDiscard: true,
      discardLabel: i18n.global.t('buttons.cancel'),
      swapNegative: true,
      okLabel: i18n.global.t('buttons.confirm')
    }
  }).onOk(() => {
    // TODO delete contact
  })
}

/**
 * Saves changed data
 * @returns {Promise<void>} -done
 */
async function onSave(){
  if(!props.contact?.id || !props.cli){
    throw new Error('TODO error message invalid contact') // TODO
  }

  // Prepare mutation parameters
  const params = {
    id: props.contact.id,
    cli: props.cli,
    name: name.value,
    phone: '+41' + phone.value.toString().replace(/\s/g, ''), // remove whitespace
    email: email.value,
    event: selection.value.includes('event'),
    alarm1: selection.value.includes('alarm1'),
    alarm2: selection.value.includes('alarm2'),
    smsLimit: selection.value.includes('smsLimit'),
    power: selection.value.includes('power'),
    memory: selection.value.includes('memory'),
    daily: selection.value.includes('daily'),
  }

  // Execute mutation
  try{
    await executeMutation(EDIT_CONTACT, params)
  } catch (e){
    console.log('Error:', e)
    // Show error notification
    showNotification(
      $q,
      i18n.global.t('errors.error_editing_contact'),
      'bottom',
      'negative',
    )
    return
  }

  // Show success notification
  showNotification(
    $q,
    i18n.global.t('messages.contact_edited'),
    'bottom',
    'positive',
  )

  // Disable edit mode
  isEditing.value = false;
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
