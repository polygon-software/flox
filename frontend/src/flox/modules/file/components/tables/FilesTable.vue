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
import {defineProps, ref} from 'vue';
import {S3File} from 'src/data/types/S3File';
import {Ref} from '@vue/reactivity';
import {date, useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';
import {fetchMyFiles, fetchPublicFiles} from 'src/helpers/data/fetch-helpers';
import {deletePrivateFile, deletePublicFile} from 'src/helpers/data/mutation-helpers';
import {showSuccessNotification} from 'src/helpers/tools/notification-helpers';

const props = defineProps({
  private: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const $q = useQuasar()

const columns = [
  { name: 'url', label: 'URL', field: 'url' },
  { name: 'UUID', align: 'center', label: 'UUID', field: 'uuid', sortable: false },
  { name: 'Created', label: 'Created (Date)', field: 'createdAt', sortable: true, format: (val: Date) => date.formatDate(val, i18n.global.t('date.date_format')) },
  { name: 'Type', label: 'Type', field: 'mimetype' },
  { name: 'Size', label: 'Size (Bytes)', field: 'size', sortable: true },
]

/**
 * Fetches all files for displaying in table
 * @returns {Promise<S3File[]>} List of Files
 */
function fetchAllFiles(): Ref<S3File[]> {
  if (props.private) {
    return fetchMyFiles();
  }
  return fetchPublicFiles();
}

const files: Ref<S3File[]> = fetchAllFiles();


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
  selected.value = [];
  showSuccessNotification($q, i18n.global.t('files.successfully_deleted', { value: 1 }))
}
</script>

