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
import {PASSWORD_REGEX} from '../../helpers/REGEX'
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
