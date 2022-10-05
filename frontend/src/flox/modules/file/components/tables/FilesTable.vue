<template>
  <div class="q-pa-md">
    <q-table
      title="Files"
      :rows="files"
      :columns="columns"
      row-key="uuid"
    >
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
import {ALL_MY_FILES, ALL_PUBLIC_FILES} from 'src/data/queries/FILES';
import {executeQuery} from 'src/helpers/data/data-helpers';
import {date} from 'quasar';
import {i18n} from 'boot/i18n';

const props = defineProps({
  private: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const columns = [
  { name: 'url', label: 'Image', field: 'url' },
  { name: 'UUID', align: 'center', label: 'UUID', field: 'uuid', sortable: false },
  { name: 'Created', label: 'Created (Date)', field: 'createdAt', sortable: true, format: (val: Date) => date.formatDate(val, i18n.global.t('date.date_format')) },
  { name: 'Type', label: 'Type', field: 'mimetype' },
  { name: 'Size', label: 'Size (Bytes)', field: 'size', sortable: true },
]

/**
 * Fetches all files for displaying in table
 * @returns {S3File[]} List of Files
 */
async function fetchAllFiles(): Promise<Array<S3File>> {
  const queryObject = props.private ? ALL_MY_FILES : ALL_PUBLIC_FILES;
  const queryResult = await executeQuery(queryObject);
  const files = (
    queryResult.data ? queryResult.data[queryObject.cacheLocation] : null
  ) as S3File[] | null;
  return files ?? [];
}

const files: Ref<S3File[]> = ref([]);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
watchEffect(async () => {
  files.value = await fetchAllFiles();
})

</script>

<style scoped>

</style>
