<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="Blubb"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <b>Change Password</b>
      <q-input label="Old Password" v-model="passwordOld" type="password"/>
      <q-input label="New Password" v-model="password" type="password"/>
      <q-input label="New Password repeated" v-model="passwordRep" type="password"/>
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
    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import {ref} from "vue";

let passwordOld = ref('')
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
    passwordOld: passwordOld.value,
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
