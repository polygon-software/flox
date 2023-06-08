<template>
  <q-card-section>
    <q-list
      v-if="files && files.length > 0"
      class="full-width q-ma-lg"
      bordered
      separator
    >
      <q-item v-for="file in files" :key="file.filename" v-ripple clickable>
        <q-item-section>
          <q-item-label lines="1">{{ file.filename }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="download" @click="downloadFile(file)" />
        </q-item-section>
      </q-item>
    </q-list>
    <QFile
      ref="filePickerRef"
      :accept="acceptedFiles"
      :label="$t('files.selected_files')"
      :max-file-size="maxFileSize"
      :max-files="maxFiles"
      :model-value="selectedFiles"
      :multiple="multiple"
      outlined
      @update:model-value="onFilePicked"
    >
      <template #append>
        <q-icon name="attach_file" />
      </template>
    </QFile>
    <FileList
      :files="selectedFiles"
      @remove-file="removeFile($event)"
      @download-file="downloadFile($event)"
    />
  </q-card-section>

  <q-card-actions align="right">
    <q-btn
      :disable="selectedFiles.length === 0"
      :label="$t('files.upload')"
      color="primary"
      icon-right="upload"
      @click="uploadSelectedFiles"
    />
  </q-card-actions>
</template>

<script lang="ts" setup>
import { QFile } from 'quasar';
import { computed, onMounted, ref, Ref, unref, watch } from 'vue';

import useFileUpload from 'src/flox/modules/file/useFileUpload';
import FileList from 'src/flox/modules/file/components/forms/fields/FileList.vue';
import { FormStateKey, useFormStore } from 'src/flox/modules/form/stores/form';
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import { getFiles } from 'src/flox/modules/file/services/file.service';
import ImageFileEntity from 'src/data/imageFile/entities/imageFileEntity';

const props = withDefaults(
  defineProps<{
    acceptedFiles: string;
    multiple: boolean;
    path: string;
    maxFiles?: number;
    maxFileSize?: number;
    stateKey?: FormStateKey | null;
  }>(),
  {
    maxFiles: 10,
    maxFileSize: 5e8, // ca. 500 MB
    stateKey: null,
  }
);

const emit = defineEmits<(e: 'change', value: FileEntity[]) => void>();

const filePickerRef: Ref<QFile | null> = ref(null);

const { selectedFiles, removeFile, onFilePicked, uploadFiles } =
  useFileUpload(filePickerRef);

/**
 * Uploads selected files to server
 */
async function uploadSelectedFiles(): Promise<void> {
  await uploadFiles(unref(props.path));
}

const store = useFormStore();
const files: Ref<FileEntity[] | undefined> = ref(undefined);

const fileUuids = computed(() => {
  const fetchedFiles = fetchByKey({
    formKey: props.stateKey?.formKey as string,
    pageKey: 'formData',
    cardKey: 'fileUpload',
    fieldKey: FIELDS.FILE_UPLOAD.key,
  }) as ImageFileEntity[] | null;
  if (fetchedFiles) {
    return fetchedFiles.map((file) => file.uuid);
  }
  return null;
});

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (selectedFiles.value) {
    const val = selectedFiles.value
      .filter((file) => file.fileEntity)
      .map((file) => file.fileEntity) as FileEntity[];
    if (props.stateKey) {
      store.setValue(props.stateKey, val);
    } else {
      emit('change', val);
    }
  }
}

/**
 * Save value on change
 */
watch(
  selectedFiles,
  () => {
    saveValue();
  },
  { deep: true }
);

onMounted(async () => {
  if (fileUuids.value) {
    files.value = await getFiles(fileUuids.value);
  }
});

/**
 * Downloads a file
 * @param  file - the file to be downloaded, must contain url
 * @return - done
 */
function downloadFile(file: FileEntity): void {
  const fileLink = document.createElement('a');
  fileLink.target = '_blank';
  fileLink.href = file.url as string;
  fileLink.setAttribute('download', file.filename as string);
  fileLink.click();
}
</script>
