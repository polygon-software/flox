<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="Change Password"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <b>Change Password</b>
      <q-form
          @submit="onSubmit"
          class="q-gutter-md"
      >
        <q-input
            label="Old Password"
            v-model="passwordOld"
            type="password"

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
              :disable="password !== passwordRep"
              @click="onSubmit"
          />
          <q-btn
              label="Cancel"
              color="primary"
              type="submit"
          />
        </q-card-actions>

      </q-form>

    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits} from 'vue';
import {ref} from 'vue';
import {PASSWORD_REGEX} from '../../helpers/REGEX'

let passwordOld = ref('')
let password = ref('')
let passwordRep = ref('')

const emit = defineEmits(['ok'])
let dialog = ref(null)

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

function show(){
  dialog.value?.show()
}

function hide(){
  dialog.value?.hide()
}


</script>

<style scoped>

</style>
