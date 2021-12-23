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

        <OfferUploadFields/>
<!--          @change=""-->
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
          @click="onOk"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref, Ref} from 'vue';
import {QDialog, openURL} from 'quasar';
import OfferUploadFields from 'components/forms/fields/document_upload/OfferUploadFields.vue';

const emit = defineEmits(['ok'])
const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const files = ref([])


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
 * Uploads the selected files and sends the offer
 * @returns {void}
 */
function onOk(): void {
  // TODO upload files
  // if (files.value.length !== 0) {
  //   for (const i of files.value) {
  //     if (existingFiles.value.indexOf(files.value[i]) === -1) {
  //       existingFiles.value.push(files.value[i])
  //     }
  //   }
  // }
  emit('ok')
  hide()
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
