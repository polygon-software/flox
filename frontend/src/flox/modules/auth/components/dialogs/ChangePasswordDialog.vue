<template>
  <q-dialog
      ref="dialogRef"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <b>{{ $t('authentication.change_password') }}</b>
      <q-form
          @submit="onSubmit"
          class="q-gutter-md"
      >
        <q-input
          :label="$t('authentication.old_password')"
          v-model="passwordOld"
          type="password"
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
            :disable="password !== passwordRep"
            @click="onSubmit"
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
import {defineEmits} from 'vue';
import {ref} from 'vue';
import {PASSWORD_REGEX} from '../../../../../helpers/REGEX'
import {useDialogPluginComponent} from 'quasar';

let passwordOld = ref('')
let password = ref('')
let passwordRep = ref('')


const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

/**
 * Upon submit, pass entered values outwards
 * @returns {void}
 */
function onSubmit(){
  onDialogOK({
    passwordNew: password.value,
    passwordOld: passwordOld.value,
  })
}
</script>
