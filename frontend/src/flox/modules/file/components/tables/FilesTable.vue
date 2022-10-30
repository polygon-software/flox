<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      title="Files"
      :rows="files"
      :columns="columns"
      row-key="uuid"
      selection="single"
    >
      <template #top>
        <q-btn
          v-if="selected.length > 0"
          color="red"
          icon="delete"
          label="Delete"
          @click="deleteSelected"
        />
      </template>
      <template #body-cell-url="slotProps">
        <q-td :props="slotProps">
          <q-img
            :src="slotProps.value"
            spinner-color="white"
            style="height: 50px; width: 150px"
            class="rounded-borders"
            fit="scale-down"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { date, useQuasar } from 'quasar';
import { defineProps, Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import {
  deleteFile,
  getAllMyFiles,
  getAllPublicFiles,
} from 'src/flox/modules/file/services/file.service';
import { showSuccessNotification } from 'src/tools/notification.tool';

const props = defineProps({
  private: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const $q = useQuasar();

const columns = [
  { name: 'url', label: 'URL', field: 'url' },
  {
    name: 'UUID',
    align: 'center',
    label: 'UUID',
    field: 'uuid',
    sortable: false,
  },
  {
    name: 'Created',
    label: 'Created (Date)',
    field: 'createdAt',
    sortable: true,
    format: (val: Date): string =>
      date.formatDate(val, i18n.global.t('date.date_format')),
  },
  { name: 'Type', label: 'Type', field: 'mimetype' },
  { name: 'Size', label: 'Size (Bytes)', field: 'size', sortable: true },
];

/**
 * Fetches all files for displaying in table
 * @returns List of Files
 */
function fetchAllFiles(): Promise<FileEntity[]> {
  if (props.private) {
    return getAllMyFiles(10, 0, 360);
  }
  return getAllPublicFiles(10, 0, 360);
}

const files: Ref<FileEntity[]> = ref([]);
const selected: Ref<FileEntity[]> = ref([]);

fetchAllFiles()
  .then((fetchedFiles) => {
    files.value = fetchedFiles;
  })
  .catch((e) => {
    console.error(e);
  });

/**
 * Deletes the selected file
 */
async function deleteSelected(): Promise<void> {
  const selectedFile = selected.value[0];
  await deleteFile(selectedFile.uuid);
  selected.value = [];
  showSuccessNotification(
    $q,
    i18n.global.t('files.successfully_deleted', { value: 1 })
  );
}
</script>
