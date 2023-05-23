<template>
  <FileNameList :files="fileNames" />
  <FloxWrapper :module="MODULES.FILE">
    <q-card class="q-ma-md">
      <!-- Header -->
      <q-card-section>
        <div class="row flex-center justify-between">
          <h5 class="q-mx-md col-auto">
            {{ $t('files.file_upload') }}
          </h5>
          <div class="row justify-around col-shrink">
            <!-- Invisible file picker (does not need a model-value, since upload is handled via event) -->
            <QFile
              v-show="false"
              ref="filePicker"
              :accept="acceptedFiles"
              :max-file-size="maxFileSize"
              :max-files="maxFiles"
              :multiple="multiple"
              :model-value="null"
              @update:model-value="onFilePicked"
            />
            <q-btn icon="add" flat @click="addFile()">
              <q-tooltip>
                {{ $t('files.add') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-show="selectedFiles.length > 0"
              class="col-auto"
              icon="restart_alt"
              flat
              @click="clearFileList()"
            >
              <q-tooltip>
                {{ $t('files.remove_all') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-show="selectedFiles.length > 0"
              icon="file_upload"
              flat
              @click="uploadFiles"
            >
              <q-tooltip>
                {{ $t('files.upload') }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator inset />

      <!-- Files -->
      <q-card-section>
        <q-list separator>
          <q-item
            v-for="(file, index) in selectedFiles"
            :key="file.content.name"
            class="row justify-between flex-center"
          >
            <q-item-section class="col-auto">
              <q-item-label>
                {{ file.content.name }}
              </q-item-label>

              <q-item-label caption>
                {{ $t('files.status') }}:
                {{ $t(`files.status_${file.status}`) }}
              </q-item-label>
            </q-item-section>

            <!-- Preview -->
            <q-item-section class="row flex-center col-grow">
              <q-img
                v-if="file.content.type.includes('image/')"
                :src="file.url"
                spinner-color="primary"
                style="max-width: 75%"
              />
              <q-item-label v-else>
                {{ $t('files.no_preview') }}
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="removeFile(index)"
              >
                <q-tooltip>
                  {{ $t('files.remove') }}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </FloxWrapper>
</template>

<script setup lang="ts">
/* eslint-disable vue/no-unused-properties */
import { QFile, QVueGlobals, useQuasar } from 'quasar';
import { Ref, ref, watchEffect } from 'vue';

import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import { UploadStatus } from 'src/flox/modules/file/enums/uploadStatus.enum';
import { MODULES } from 'src/flox/enum/MODULES';
import {
  SelectedFile,
  uploadFile,
} from 'src/flox/modules/file/tools/upload.tools';
import { getAllFiles } from 'src/flox/modules/file/services/file.service';
import FileNameList from 'src/flox/modules/form/components/fields/general/FileNameList.vue';
import { i18n } from 'boot/i18n';

const props = withDefaults(
  defineProps<{
    acceptedFiles?: string;
    autoUpload?: boolean;
    hideUploadButton?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    maxTotalSize?: number;
    multiple?: boolean;
    queryName: string;
    sendRaw?: boolean;
    target: string;
    url?: string;
  }>(),
  {
    acceptedFiles: '.jpg, .jpeg, .pdf, image/*',
    autoUpload: false,
    hideUploadButton: false,
    maxFiles: 100,
    maxFileSize: 5e7,
    maxTotalSize: 5e7,
    multiple: true,
    sendRaw: true,
    url: process.env.VUE_APP_BACKEND_URL ?? '',
  }
);

const fileNames = ref<string[]>([]); // This ref will hold the file names

/**
 * fetch All files
 */
async function fetchFiles(): Promise<void> {
  const files = await getAllFiles(100, 0, `${props.url}`, 360);
  fileNames.value = files.map((file) => file.filename ?? ''); // Extract the file names
}

// use the async function inside watchEffect
watchEffect(() => {
  void fetchFiles(); // it's okay if we don't handle the Promise here
});

const showQFile = ref(false);
const filePicker: Ref<QFile | null> = ref(null);
const selectedFiles: Ref<Array<SelectedFile>> = ref([]);

const $q: QVueGlobals = useQuasar();

/**
 * Notify the user that the upload failed
 *
 * @param failedEntries - failed entries
 */
function onFailed(failedEntries: SelectedFile[]): void {
  $q.notify({
    type: 'negative',
    message: i18n.global.t('files.failed_upload', {
      value: failedEntries.length,
    }),
  });
}

/**
 * Notify the user that the upload succeeded
 *
 * @param successfulEntries - successful entries
 */
function onSuccess(successfulEntries: SelectedFile[]): void {
  $q.notify({
    type: 'positive',
    message: i18n.global.t('files.successfully_uploaded', {
      value: successfulEntries.length,
    }),
  });
}

/**
 * Open the dialog to select files for upload
 * @returns {void} - done
 */
function addFile(): void {
  showQFile.value = true;
  filePicker.value?.pickFiles();
}

/**
 * Removes a file from the file list
 * @param {int} index - The index of file to remove
 * @return {void} void
 */
function removeFile(index: number): void {
  selectedFiles.value.splice(index);
}

/**
 * Removes all files that have been selected so far
 * @return {void} void
 */
function clearFileList(): void {
  selectedFiles.value = [];
}

/**
 * Triggered when a file is picked from the file picker dialog
 * @param {File[]} newFiles - the newly picked files
 * @returns {void}
 */
function onFilePicked(newFiles: File[]): void {
  showQFile.value = false;
  newFiles.forEach((file) => {
    const newSelectedFile: SelectedFile = {
      content: file,
      url: URL.createObjectURL(file),
      status: UploadStatus.READY,
    };
    selectedFiles.value = [...selectedFiles.value, newSelectedFile];
  });
}

/**
 * Triggers a separate upload for each file. Only uploads files that haven't been successfully uploaded before.
 *
 * @param path - path to which file shall be uploaded to
 */
async function uploadAllFiles(path: string): Promise<void> {
  // TODO: Fix upload to load files to AWS
  const uploads = selectedFiles.value.map(async (file) => {
    if (file.status !== UploadStatus.DONE) {
      // eslint-disable-next-line no-param-reassign
      file.status = UploadStatus.LOADING;
      try {
        await uploadFile(file, { path });
        // eslint-disable-next-line no-param-reassign
        file.status = UploadStatus.DONE;
      } catch (e: any) {
        console.error(e);
        // eslint-disable-next-line no-param-reassign
        file.status = UploadStatus.FAILED;
      }
    }
  });
  await Promise.allSettled(uploads);

  // Check for successful uploads
  const successfulUploads = selectedFiles.value.filter(
    (file) => file.status === UploadStatus.DONE
  );
  if (successfulUploads.length > 0) {
    onSuccess(successfulUploads);
  }

  // Check for failed uploads
  const failedUploads = selectedFiles.value.filter(
    (file) => file.status === UploadStatus.FAILED
  );
  if (failedUploads.length > 0) {
    onFailed(failedUploads);
  }
}

/**
 * Upload Files
 */
async function uploadFiles(): Promise<void> {
  await uploadAllFiles(props.url);
}
</script>
