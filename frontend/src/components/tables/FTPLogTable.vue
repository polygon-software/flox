<template>
  <strong class="q-mt-lg">
    {{ $t('log_files.ftp_log_file') }}
  </strong>
  <div class="column">
    <q-table
      v-model:pagination="pagination"
      class="q-mt-lg"
      :rows="rows"
      flat
      :columns="columns"
      :loading="loading"
      row-key="id"
      :rows-per-page-options="[10, 20, 50]"
      separator="none"
      style="width: 700px;"
      @request="onRequest"
    >
      <template #body="_props">
        <q-tr
          :props="_props"
        >
          <q-td key="date_time">
            {{ formatDateTime(_props.row.timestamp) }}
          </q-td>
          <q-td key="ip">
            {{ _props.row.ip }}
          </q-td>
          <q-td key="path">
            {{ _props.row.path }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref, defineProps} from 'vue';
import {i18n} from 'boot/i18n';
import {ftpLogForDevice} from 'src/helpers/api-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';
import {FTPLogEntry} from 'src/data/types/FTPLogEntry';

const props = defineProps({
  cli: {
    type: String,
    required: true
  },
})

// Pagination
const skip = ref(0)
const take = ref(10) // Load first 10 entries by default
const loading = ref(true)

// QTable pagination
const pagination = ref(
  {
    sortBy: 'timestamp',
    descending: false,
    page: 1,
    rowsNumber: 1, // initially assume at least 1 entry
    rowsPerPage: take.value
  }
)

// ----- Data -----
const columns = [
  { name: 'timestamp', label: i18n.global.t('client_connectivity.date_time'), field: 'timestamp', sortable: false, align: 'center' },
  { name: 'ip', label: i18n.global.t('log_files.ip'), field: 'ip', sortable: false, align: 'center' },
  { name: 'path', label: i18n.global.t('log_files.path'), field: 'path', sortable: false, align: 'center' },
]

const rows: Ref<FTPLogEntry[]> = ref([])

// Fetch logs on mount
onMounted(async () => {
  // Fetch initial data
  await onRequest({
    pagination: pagination.value,
  })
})

/**
 * Handle server-side pagination on new page request
 * @param {Record<string, Record<string, number>>} reqProps - new pagination data
 * @returns {Promise<void>} - done
 */
async function onRequest(reqProps: Record<string, Record<string, number|string|boolean>>){
  loading.value = true

  const { page, rowsPerPage } = reqProps.pagination

  // Update pagination
  pagination.value.page = page as number
  pagination.value.rowsPerPage = rowsPerPage as number

  // Update fetching properties
  take.value = rowsPerPage as number
  skip.value = ((page as number)-1) * take.value

  // Re-fetch
  await fetchLogs()
}

/**
 * Fetches table contents and update rows and pagination
 * @returns {Promise<void>} - done
 */
async function fetchLogs(){
  const log = await ftpLogForDevice(props.cli, skip.value, take.value)
  rows.value = log.entries
  pagination.value.rowsNumber = log.total

  loading.value = false
}
</script>
