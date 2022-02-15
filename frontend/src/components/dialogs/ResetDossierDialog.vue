<template>
  <q-dialog
    ref="dialogRef"
    :title="$t('dashboards.dossier')"
  >
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <h5>{{ $t('dossier.reset_dossier') }}</h5>
        <p>
          {{ $t('dossier.reset_dossier_description')}}
        </p>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('dossier.reset_dossier')"
          color="negative"
          @click="onDialogOK"
        />
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          @click="onDialogCancel"
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
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

