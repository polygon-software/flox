<template>
  <q-dialog
    ref="dialogRef"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 300px">
      <q-card-section class="flex flex-center column">
        <h5 class="q-ma-sm">
          {{ $t('account_data.conditions') }}
        </h5>
        <p>TODO TODO</p>
      </q-card-section>
      <q-separator dark/>
      <q-card-actions align="center">
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
import {defineEmits} from 'vue';
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>
