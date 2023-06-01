<template>
  <q-card-section>
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
    <FileList :files="selectedFiles" @remove-file="removeFile($event)" />
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
import { ref, Ref, unref, watch } from 'vue';

import useFileUpload from 'src/flox/modules/file/useFileUpload';
import FileList from 'src/flox/modules/file/components/forms/fields/FileList.vue';
import { FormStateKey, useFormStore } from 'src/flox/modules/form/stores/form';
import FileEntity from 'src/flox/modules/file/entities/file.entity';

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

const emit = defineEmits<{
  (e: 'change', value: FileEntity[]): void;
}>();

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
</script>
