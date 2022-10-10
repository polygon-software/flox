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
        <q-btn
          v-if="selected.length > 0"
          color="green"
          icon="arrow-up"
          label="Convert to Image"
          @click="openSelectedAsImage"
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
import {defineProps, ref, watchEffect} from 'vue';
import {S3File} from 'src/data/types/S3File';
import {Ref} from '@vue/reactivity';
import {date, useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';
import {fetchMyFiles, fetchPublicFiles, getImageForFile} from 'src/helpers/data/fetch-helpers';
import {deletePrivateFile, deletePublicFile} from 'src/helpers/data/mutation-helpers';
import {showNotification} from 'src/helpers/tools/notification-helpers';

const props = defineProps({
  private: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const $q = useQuasar()

const columns = [
  { name: 'url', label: 'Image', field: 'url' },
  { name: 'UUID', align: 'center', label: 'UUID', field: 'uuid', sortable: false },
  { name: 'Created', label: 'Created (Date)', field: 'createdAt', sortable: true, format: (val: Date) => date.formatDate(val, i18n.global.t('date.date_format')) },
  { name: 'Type', label: 'Type', field: 'mimetype' },
  { name: 'Size', label: 'Size (Bytes)', field: 'size', sortable: true },
]

/**
 * Fetches all files for displaying in table
 * @returns {Promise<S3File[]>} List of Files
 */
function fetchAllFiles(): Promise<Array<S3File>> {
  if (props.private) {
    return fetchMyFiles();
  }
  return fetchPublicFiles();
}

const files: Ref<S3File[]> = ref([]);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
watchEffect(async () => {
  files.value = await fetchAllFiles();
})

const selected: Ref<S3File[]> = ref([]);

/**
 * Deletes the selected file
 * @returns {void}
 */
async function deleteSelected() {
  const selectedFile = selected.value[0]
  if (props.private) {
    await deletePrivateFile(selectedFile.uuid);
  } else {
    await deletePublicFile(selectedFile.uuid);
  }
  files.value = files.value.filter((f) => f !== selectedFile);
  selected.value = [];
  showNotification($q, i18n.global.t('successfully_deleted', { value: 1 }), 'top-right', 'green')
}

/**
 * Loads an image for a given file
 * @returns {void}
 */
async function openSelectedAsImage() {
  const selectedFile = selected.value[0];
  const image = await getImageForFile(selectedFile.uuid);
  console.log(image);
}
</script>

