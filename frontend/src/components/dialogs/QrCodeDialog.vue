<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
      title="QR"
      @hide="onDialogHide"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">Set up 2FA</h5>
        <p class="text-grey-8">
          TODO a description of authenticator setup will go here. Lorem ipsum dolor sit amet bla
        </p>
        <qrcode-vue
            :value="props.value"
            :size="180"
        />
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="right">
        <q-btn
            label="Abbrechen"
            color="primary"
            @click="onDialogCancel"
        />
        <q-btn
            label="OK"
            color="primary"
            @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import {defineProps, ref, Ref} from 'vue';
import {QDialog, useDialogPluginComponent} from 'quasar'

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*.../* }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function show(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: '',
  },
})

</script>
