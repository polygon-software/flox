<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="Blubb"
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
import {defineEmits} from "vue";
import {ref} from "vue";
import {PASSWORD_REGEX} from "@/plugins/Regex"

let verificationCode = ref('')
let password = ref('')
let passwordRep = ref('')

const emit = defineEmits(['ok'])
let dialog = ref(null)

/**
 * TODO
 */
function onSubmit(){
  emit('ok', {
    passwordNew: password.value,
    verificationCode: verificationCode.value,
  })
  hide()
}

// eslint-disable-next-line no-unused-vars
function show(){
  //@ts-ignore
  dialog.value?.show()
}

// eslint-disable-next-line no-unused-vars
function hide(){
  //@ts-ignore
  dialog.value?.hide()
}


</script>

<style scoped>

</style>
