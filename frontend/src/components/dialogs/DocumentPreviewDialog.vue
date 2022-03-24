<template>
  <q-dialog
    ref="dialogRef"
    title="Preview"
  >
    <q-card
      class="q-pa-sm text-center"
      style="width: 700px; max-width: 700px; height: 100%; max-height: 1100px"
    >
      <q-card-section
        class="full-width column"
        style="height: calc(100% - 60px)"
      >
        <embed
          :src="props.url"
          class="q-pa-sm"
          frameBorder="0"
          scrolling="auto"
          style="height: calc(100% - 50px); width: 100%; max-height: 900px"
        />
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

const props = defineProps({
  url: {
    required: true,
    type: String,
    default: '',
  },
})
</script>
