<template>
  <FloxWrapper :module="MODULES.FILE">
    <q-card class="q-ma-md" style="width: 600px">
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
              :accept="props.acceptedFiles"
              :max-file-size="props.maxFileSize"
              :max-files="props.maxFiles"
              :multiple="props.multiple"
              @update:model-value="onFilePicked"
            />
            <q-btn icon="add" flat @click="addFile">
              <q-tooltip>
                {{ $t('files.add') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-show="selectedFiles.length > 0"
              class="col-auto"
              icon="restart_alt"
              flat
              @click="clearFileList"
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
      <FileList :files="selectedFiles" @remove-file="removeFile($event)" />
    </q-card>
  </FloxWrapper>
</template>

<script setup lang="ts">
import { QFile } from 'quasar';
import { defineProps, Ref, ref } from 'vue';

import Env from 'src/env';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import { MODULES } from 'src/flox/MODULES';
import useFileUpload from 'src/flox/modules/file/useFileUpload';
import FileList from 'src/flox/modules/file/components/forms/fields/FileList.vue';

const props = defineProps({
  acceptedFiles: {
    type: String,
    default: '.jpg, .pdf, image/*',
  },
  autoUpload: {
    type: Boolean,
    default: false,
  },
  hideUploadButton: {
    type: Boolean,
    default: false,
  },
  maxFiles: {
    type: Number,
    default: 10,
  },
  maxFileSize: {
    type: Number,
    default: 5e7, // ca. 50 MB
  },
  maxTotalSize: {
    type: Number,
    default: 5e7,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  sendRaw: {
    type: Boolean,
    default: true,
  },
  url: {
    type: String,
    default: Env.VUE_APP_BACKEND_URL,
  },
});

const filePicker: Ref<QFile | null> = ref(null);

const {
  selectedFiles,
  addFile,
  removeFile,
  clearFileList,
  onFilePicked,
  uploadFiles,
} = useFileUpload(filePicker);
</script>
