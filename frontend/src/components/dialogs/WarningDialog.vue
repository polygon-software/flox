<template>
  <q-dialog
    ref="dialogRef"
    :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <div
          class="bg-warning flex-center flex"
          style="height: 120px; width: 120px; border-radius: 60px; margin-bottom: 10px"
        >
          <q-icon
            name="warning"
            color="white"
            size="80px"
          />
        </div>
        <h5 class="q-ma-sm">
          {{ $t('general.warning') }}
        </h5>
        <p v-if="description" style="margin-top: 20px">
          {{ description }}
        </p>
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="center">
        <q-btn
          v-if="showDiscard"
          :label="discardLabel"
          flat
          :color="swapNegative ? 'primary' : 'negative'"
          @click="onCancel"
        />
        <q-btn
          :label="okLabel"
          :color="swapNegative ? 'negative' : 'primary'"
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
/**
 * This is a generic warning dialog that accepts a description and (optionally) button labels. Note that it does not
 * execute any functionality, but only emits the 'ok' and 'discard' events.
 */

import {defineEmits, defineProps} from 'vue';
import {i18n} from 'boot/i18n';
import { useDialogPluginComponent } from 'quasar'

const emit = defineEmits([...useDialogPluginComponent.emits, 'cancel'])

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  okLabel: {
    type: String,
    required: false,
    default: i18n.global.t('buttons.ok'),
  },
  discardLabel: {
    type: String,
    required: false,
    default: i18n.global.t('buttons.discard'),
  },
  showDiscard: {
    type: Boolean,
    required: false,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  swapNegative: { // Swaps negative and primary colors, making "Ok" negative
    type: Boolean,
    required: false,
    default: false
  }
})

/**
 * On cancel, emit
 * @returns {void}
 */
function onCancel(){
  emit('cancel')
  onDialogHide()
}
</script>
