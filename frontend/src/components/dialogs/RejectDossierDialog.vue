<template>
  <q-dialog
    ref="dialog"
    title="Application"
  >
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <h5 class="q-ma-md">
          {{ $t('dossier.reject_dossier') }}
        </h5>
        <q-separator style="margin: 24px 0 24px 0"/>
        <q-input
          v-model="rejectReason"
          :label="$t('dossier.reject_reason')"
          outlined
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          flat
          @click="onCancel"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('dossier.reject_dossier')"
          color="negative"
          :disable="rejectReason.length === 0"
          @click="onReject"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref, defineEmits} from 'vue'
import {QDialog} from 'quasar';

const emit = defineEmits(['ok'])

const rejectReason = ref('')

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

// eslint-disable-next-line require-jsdoc
function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * Emits reject event, including the entered reason
 * @returns {void}
 */
function onReject(): void {
  emit('ok', rejectReason)
  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}
</script>

