<template>
  <q-dialog
      ref="dialogRef"
      :persistent="true"
  >
    <q-card class="q-pa-lg q-pt-xl" style="width: 400px; min-height: 250px">
      <q-form
        @submit="onSubmit"
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      >
        <b>{{ $t('authentication.forgot_password') }}</b>
        <q-input
          :label="$t('authentication.verification_code')"
          v-model="verificationCode"
        />
        <q-input
          :label="$t('authentication.new_password')"
          v-model="password"
          type="password"
          :rules="[
            val => PASSWORD_REGEX.test(val) || $t('errors.invalid_password')
          ]"
        />
        <q-input
          :label="$t('authentication.new_password_repeat')"
          v-model="passwordRep"
          type="password"
          :rules="[
             val => val === password || $t('errors.non_matching_password'),
          ]"
        />
        <q-card-actions align="right">

          <q-btn
            color="primary"
            :label="$t('general.confirm')"
            :disable="password !== passwordRep || verificationCode.length !== 6"
            type="submit"
          />
          <q-btn
            :label="$t('general.cancel')"
            color="primary"
            @click="onDialogHide"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits, ref} from 'vue';
import {PASSWORD_REGEX} from '../../../../../helpers/REGEX'
import {useDialogPluginComponent} from 'quasar';

let verificationCode = ref('')
let password = ref('')
let passwordRep = ref('')

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent() // TODO in other dialogs as well!

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

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
