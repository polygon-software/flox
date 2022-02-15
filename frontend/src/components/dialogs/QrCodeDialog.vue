<template>
  <q-dialog
    ref="dialogRef"
    :persistent="true"
    title="QR"
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
import {defineEmits, defineProps} from 'vue';
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: '',
  },
})
</script>
