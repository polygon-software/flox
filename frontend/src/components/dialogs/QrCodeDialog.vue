<template>
  <q-dialog
    ref="dialogRef"
    :persistent="true"
    title="QR"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">
          {{ $t('authentication.qr_title')}}
        </h5>
        <p class="text-grey-8">
          {{ $t('authentication.qr_description') }}
        </p>
        <qrcode-vue
          :value="props.value"
          :size="180"
        />
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="right">
        <q-btn
          :label="$t('buttons.cancel')"
          color="primary"
          @click="onDialogCancel"
        />
        <q-btn
          :label="$t('buttons.ok')"
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
