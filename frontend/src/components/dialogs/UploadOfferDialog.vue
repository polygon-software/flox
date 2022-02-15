<template>
  <q-dialog
    ref="dialogRef"
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
          @click="onDialogCancel"
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
import {defineEmits, ref, Ref} from 'vue';
import OfferUploadFields from 'components/forms/fields/document_upload/OfferUploadFields.vue';
import {uploadFiles} from 'src/helpers/file-helpers';
import { useDialogPluginComponent } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(useDialogPluginComponent.emits)

// REQUIRED; must be called inside of setup()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()


const props = defineProps({
  offerUuid: {
    type: String,
    required: true
  }
})

// Uploaded files (key: filename, value: file)
const files: Ref<Record<string, unknown>> = ref({})


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
  onDialogOK()
}


</script>
