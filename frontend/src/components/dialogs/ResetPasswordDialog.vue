<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="Blubb"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <b>Reset Password</b>
        <q-input
          v-model="verificationCode"
          label="Email Verification Code"
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
              :disable="password !== passwordRep || verificationCode.length !== 6"
              type="submit"
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
import {defineEmits} from 'vue';
import {ref} from 'vue';
import {PASSWORD_REGEX} from 'src/helpers/REGEX'
import {useDialogPluginComponent} from 'quasar';

let verificationCode = ref('')
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

/**
 * On submit, emit data outwards
 */
function onSubmit(){
  emit('ok', {
    passwordNew: password.value,
    verificationCode: verificationCode.value,
  })
  onDialogHide()
}

</script>
