<template>
  <q-dialog
      ref="dialogRef"
      :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <q-form
          class="q-gutter-md"
          @submit="onSubmit"
      >
        <strong>Reset Password</strong>
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
              @click="onDialogCancel"
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
import { QDialog, useDialogPluginComponent } from 'quasar';

let verificationCode = ref('')
let password = ref('')
let passwordRep = ref('')

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emits = defineEmits(useDialogPluginComponent.emits)

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  onDialogOK({
    passwordNew: password.value,
    verificationCode: verificationCode.value,
  })
}

</script>
