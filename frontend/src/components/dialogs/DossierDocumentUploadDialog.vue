<template>
  <q-dialog
    ref="dialog"
    :title="$t('dashboards.dossier')"
  >
    <q-card class="q-pa-md q-ma-md" style="width: 450px">
      <q-card-section>
        <h5 class="q-ma-none">
          {{ $t('documents.document_upload') }}
        </h5>
        <q-linear-progress
          :value="progress/total"
          rounded
          size="10px"
          style="margin: 24px 0 24px 0"
        />
        <p style="text-align: center">
          {{ $t('general.uploading', {progress, total}) }}
        </p>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.finish')"
          color="primary"
          :disable="loading"
          @click="onOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, Ref, defineEmits, onMounted} from 'vue'
import {QDialog} from 'quasar';

const emit = defineEmits(['ok'])

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const progress = ref(0)

// Whether file upload is still in progress
const loading = ref(true)

// Total number of files to upload, calculated once upload starts
const total = ref(1)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  files: {
    type: Object,
    required: true,
  }
})

onMounted(async () => {
  await uploadAllFiles();

  // Finished, allow closing dialog
  loading.value = false;
})

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

/**
 * Uploads all files belonging to the dossier
 * @returns {Promise<void>} - done
 */
// TODO remove
// eslint-disable-next-line @typescript-eslint/require-await,require-jsdoc
async function uploadAllFiles(){
  const files = props.files as Record<string, unknown>

  // For every section
  Object.keys(files).forEach((sectionKey) => {
    // For every field within section
    Object.keys(files[sectionKey]).forEach((fieldKey) => {
      // Find files
      const fieldFiles = files[sectionKey][fieldKey] as File[] ?? []

      // Update total length
      total.value += fieldFiles.length

      // Upload all files
      for(const file of fieldFiles){
        // TODO
        console.log('upload file', file.name)
      }
    })
  })

  // Decrease by 1, since we start at 1 to avoid zero-division
  total.value--
}

// eslint-disable-next-line require-jsdoc
function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * Confirm finished file upload
 * @returns {void}
 */
function onOk(): void {
  emit('ok')
  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}
</script>

