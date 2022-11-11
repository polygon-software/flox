<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('files.add') }}</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section>
        <q-file
          ref="filePickerRef"
          outlined
          :label="$t('files.selected_files')"
          :accept="props.acceptedFiles"
          :max-file-size="props.maxFileSize"
          :max-files="props.maxFiles"
          :multiple="props.multiple"
          @update:model-value="onFilePicked"
        >
          <template #append>
            <q-icon name="attach_file" />
          </template>
        </q-file>
        <FileList :files="selectedFiles" @remove-file="removeFile($event)" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="$t('general.cancel')" outline @click="onDialogCancel" />
        <q-btn
          :disable="selectedFiles.length === 0"
          color="primary"
          :label="$t('files.upload')"
          icon-right="upload"
          @click="uploadSelectedFiles"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QFile, useDialogPluginComponent } from 'quasar';
import { defineProps, ref, Ref } from 'vue';

import useFileUpload from 'src/flox/modules/file/useFileUpload';
import FileList from 'src/flox/modules/file/components/forms/fields/FileList.vue';

const props = withDefaults(
  defineProps<{
    acceptedFiles: string;
    maxFiles: number;
    maxFileSize: number;
    multiple: boolean;
    path: string;
  }>(),
  {
    maxFiles: 10,
    maxFileSize: 5e7, // ca. 50 MB
  }
);

defineEmits([...useDialogPluginComponent.emits]);

const filePickerRef: Ref<QFile | null> = ref(null);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { selectedFiles, removeFile, onFilePicked, uploadFiles } =
  useFileUpload(filePickerRef);

/**
 * Uploads selected files to server
 */
async function uploadSelectedFiles(): Promise<void> {
  await uploadFiles(props.path.value);
  onDialogOK();
}
</script>

<style scoped></style>
