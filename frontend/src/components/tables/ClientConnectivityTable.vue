<template>
  <strong>{{ $t('client_connectivity.title') }}</strong>
  <div class="column">
    <q-table
      v-model:pagination="pagination"
      class="q-mt-lg"
      :rows="rows"
      flat
      :columns="columns"
      :loading="loading"
      row-key="id"
      :rows-per-page-options="[10]"
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
          <q-td key="real_ip">
            {{ _props.row.realIp }}
          </q-td>
          <q-td key="port">
            {{ _props.row.port }}
          </q-td>
          <q-td key="vpn_ip">
            {{ _props.row.vpnIp }}
          </q-td>
          <q-td key="event">
            {{ _props.row.reason }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref, defineProps, watch} from 'vue';
import {i18n} from 'boot/i18n';
import {ConnectionLogEntry} from 'src/data/types/ConnectionLogEntry';
import {connectionLogForDevice, deviceConnectionLogCount} from 'src/helpers/api-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';

const props = defineProps({
  cli: {
    type: String,
    required: true
  }
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
  { name: 'realIp', label: i18n.global.t('client_connectivity.real_ip'), field: 'realIp', sortable: false, align: 'center' },
  { name: 'port', label: i18n.global.t('client_connectivity.port'), field: 'port', sortable: false, align: 'center' },
  { name: 'vpnIp', label: i18n.global.t('client_connectivity.vpn_ip'), field: 'vpnIp', sortable: false, align: 'center' },
  { name: 'event', label: i18n.global.t('client_connectivity.event'), field: 'event', sortable: false, align: 'center' },
]

const rows: Ref<ConnectionLogEntry[]> = ref([])

// Fetch logs on mount
onMounted(async () => {
  // Fetch initial data
  await onRequest({
    pagination: pagination.value,
  })
})

// ComputedRef for total row count
const rowsNumber = deviceConnectionLogCount(props.cli)

// Update if new number of rows detected
watch(rowsNumber, (newVal) => {
  // Get total row count (for pagination)
  pagination.value.rowsNumber = newVal
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
 * Fetches table contents
 * @returns {Promise<void>} - done
 */
async function fetchLogs(){
  rows.value = await connectionLogForDevice(props.cli, skip.value, take.value)
  loading.value = false
}

</script>
