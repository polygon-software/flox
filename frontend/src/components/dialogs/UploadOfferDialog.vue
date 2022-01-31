<template>
  <q-dialog
    ref="dialog"
    :title="$t('employee_dashboard.all_documents')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h5
          class="q-ma-md"
        >
          {{ $t('dossier.upload_offer') }}
        </h5>
        <q-separator style="margin: 24px 0 24px 0"/>

        <OfferUploadFields
          @change="onFilesChange"
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
          :label="$t('dossier.send_offer')"
          color="primary"
          style="border-radius: 8px"
          :disable="Object.keys(files).length === 0"
          @click="onOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref, Ref} from 'vue';
import {QDialog} from 'quasar';
import OfferUploadFields from 'components/forms/fields/document_upload/OfferUploadFields.vue';
import {uploadFiles} from 'src/helpers/file-helpers';

const emit = defineEmits(['ok'])
const props = defineProps({
  offerUuid: {
    type: String,
    required: true
  }
})
const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

// Uploaded files (key: filename, value: file)
const files: Ref<Record<string, unknown>> = ref({})


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
 * When files in form change, update
 * @param {Record<string, File>} newFiles - the new state of the files
 * @returns {void}
 */
function onFilesChange(newFiles: Record<string, File>){
  files.value = newFiles
}

/**
 * Uploads the selected files and sends the offer
 * @returns {void}
 */
async function onOk(): Promise<void> {
  await uploadFiles(files.value, `/uploadOfferFile?oid=${props.offerUuid}`, 'allDossiersBank')
  emit('ok')
  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
