<template>
  <q-dialog
    ref="dialogRef"
    title="Preview"
  >
    <q-card
      class="flex content-center items-center bg-transparent"
      flat
      style="width: 1000px; max-width: 1500px; height: 1000px; max-height: 1500px;"
    >
      <q-card-section>
        <object
          :data="props.url + '#page=1&zoom=80'"
          type="application/pdf"
          width="950"
          height="950"
        >
          <embed :src="props.url" type="application/pdf" />
        </object>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits} from 'vue';
import { useDialogPluginComponent } from 'quasar'

const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  url: {
    required: true,
    type: String,
    default: '',
  },
})
</script>
