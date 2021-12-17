<template>
  <q-dialog
    ref="dialog"
    title="Application"
  >
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <h5>{{ $t('dashboards.sure_to_reject') }}</h5>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('dashboards.yes_reject')"
          color="negative"
          @click="onYesReject"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref, defineEmits} from 'vue'
import {QDialog} from 'quasar';

const emit = defineEmits(['ok'])

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
 * Reject an application
 * @returns {void}
 */
function onYesReject(): void {
  emit('ok')
  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}
</script>

