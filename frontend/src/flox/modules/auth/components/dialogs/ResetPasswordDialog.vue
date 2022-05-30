<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <q-form
          @submit="onSubmit"
          class="q-gutter-md"
      >
        <b>Reset Password</b>
        <q-input
            label="Email Verification Code"
            v-model="verificationCode"
        />
        <q-input
            label="New Password"
            v-model="password"
            type="password"
            :rules="[
              val => PASSWORD_REGEX.test(val) || 'Not ok'
            ]"
        />
        <q-input
            label="New Password repeated"
            v-model="passwordRep"
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
import {defineEmits, Ref} from 'vue';
import {ref} from 'vue';
import {PASSWORD_REGEX} from '../../../../../helpers/REGEX'
import {QDialog} from 'quasar';

let verificationCode = ref('')
let password = ref('')
let passwordRep = ref('')

const emit = defineEmits(['ok'])
let dialog: Ref<QDialog|null> = ref(null)

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  emit('ok', {
    passwordNew: password.value,
    verificationCode: verificationCode.value,
  })
  hide()
}

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
 dialog.value?.show()
}

// eslint-disable-next-line require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

</script>
