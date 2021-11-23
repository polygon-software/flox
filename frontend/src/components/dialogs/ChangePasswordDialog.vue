<template>
  <q-dialog
      ref="dialog"
      title="Change Password"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <b>Change Password</b>
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <q-input
          v-model="passwordOld"
          label="Old Password"
          type="password"
        />
        <q-input
          v-model="password"
          label="New Password"
          type="password"
          :rules="[
            val => PASSWORD_REGEX.test(val) || 'Not ok'
          ]"
        />
        <q-input
          v-model="passwordRep"
          label="New Password repeated"
          type="password"
          :rules="[
            val => val === password || 'Passwords must be identical',
          ]"
        />
        <q-card-actions align="right">

          <q-btn
            color="primary"
            label="Change"
            :disable="password !== passwordRep"
            @click="onSubmit"
          />
          <q-btn
              label="Cancel"
              color="primary"
              @click="hide"
          />
        </q-card-actions>

      </q-form>

    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits, Ref} from 'vue';
import {ref} from 'vue';
import {PASSWORD_REGEX} from 'src/helpers/REGEX'
import {QDialog, useDialogPluginComponent} from 'quasar';

let passwordOld = ref('')
let password = ref('')
let passwordRep = ref('')

const emit = defineEmits(['ok'])

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*.../* }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function show(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * Upon submit, pass entered values outwards
 */
function onSubmit(){
  emit('ok', {
    passwordNew: password.value,
    passwordOld: passwordOld.value,
  })
  hide()
}


</script>
