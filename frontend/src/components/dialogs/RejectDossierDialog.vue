<template>
  <q-dialog
    ref="dialogRef"
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
          @click="onDialogCancel"
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
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const rejectReason = ref('')



/**
 * Emits reject event, including the entered reason
 * @returns {void}
 */
function onReject(): void {
  onDialogOK(rejectReason.value)
}


</script>

