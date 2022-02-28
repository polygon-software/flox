<template>
  <q-dialog
      ref="dialogRef"
      :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 600px; min-height: 250px">
      <h5 style="text-align: center">{{ $t('edit_parameters.add_new_contact') }}</h5>
      <q-form
          class="q-gutter-md"
          @submit="onSubmit"
      >
        <div style="display:flex; flex-direction: row">
          <div style="width: 250px">
            <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.name') }}</p>
            <q-input
              v-model="name"
              outlined
            />
            <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.number') }}</p>
            <q-input
              v-model="phone"
              type="number"
              outlined
              prefix="+41"
            />
            <p style="color: #87858A; margin-top: 25px; margin-bottom: 0">{{ $t('edit_parameters.email') }}</p>
            <q-input
              v-model="email"
              type="email"
              outlined
            />
          </div>
          <div style="display: flex; flex-direction: column; margin-top: 35px; margin-left: 35px; color: #87858A">
            <q-checkbox
              v-for="checkbox in checkboxes"
              :key="checkbox.val"
              v-model="selection"
              :val="checkbox.val"
              :label="checkbox.label"
            />
          </div>
        </div>
        <q-card-actions align="center">
          <q-btn
            :label="$t('buttons.load')"
            outline
            class="text-grey"
            @click="onLoad"
          />
          <q-btn
            :label="$t('buttons.save')"
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

const name = ref('')
const phone = ref('')
const email = ref('')
const selection = ref([])

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

const checkboxes = [
  {val: 'event', label: 'Event'},
  {val: 'alarm1', label: 'Alarm 1'},
  {val: 'alarm2', label: 'Alarm 2'},
  {val: 'sms', label: 'SMS limit'},
  {val: 'power_battery', label: 'Power/Battery'},
  {val: 'memory', label: 'Memory'},
  {val: 'daily', label: 'Daily'},
]

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  onDialogOK({
    name: name.value,
    phone: phone.value,
    email: email.value,
    checkbox: checkboxes.values()
  })
}

/**
 * On load, .....
 * @returns {void}
 */
function onLoad(){
  //TODO: what does load button?
  onDialogCancel()
}

</script>
