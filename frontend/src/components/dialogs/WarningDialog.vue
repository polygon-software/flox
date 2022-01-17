<template>
  <q-dialog
    ref="dialog"
    :persistent="true"
    title="QR"
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
          color="negative"
          @click="onDiscard"
        />
        <q-btn
          :label="okLabel"
          color="primary"
          @click="onOk"
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

import {defineEmits, defineProps, ref, Ref} from 'vue';
import {QDialog} from 'quasar'
import {i18n} from 'boot/i18n';

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)
const emit = defineEmits(['ok', 'discard'])

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

})

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

/**
 * On Ok, emit ok event
 * @returns {void}
 */
function onOk(): void {
  emit('ok')
  hide()
}

/**
 * On discard, emit event
 * @returns {void}
 */
function onDiscard(): void {
  emit('discard')
  hide()
}
</script>
