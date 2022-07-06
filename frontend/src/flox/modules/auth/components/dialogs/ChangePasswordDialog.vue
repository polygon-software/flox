<template>
  <q-dialog
      ref="dialog"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <strong>{{ $t('authentication.change_password') }}</strong>
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

let passwordOld = ref('')
let password = ref('')
let passwordRep = ref('')

const emit = defineEmits(['ok'])
const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

/**
 * Upon submit, pass entered values outwards
 * @returns {void}
 */
function onSubmit(){
  emit('ok', {
    passwordNew: password.value,
    passwordOld: passwordOld.value,
  })
  hide()
}

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

// eslint-disable-next-line require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}
</script>
