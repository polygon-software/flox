<template>
  <q-dialog
    ref="dialogRef"
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
import { useDialogPluginComponent } from 'quasar'
import {defineEmits} from 'vue';

const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

</script>

