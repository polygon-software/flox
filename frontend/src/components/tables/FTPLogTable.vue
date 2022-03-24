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
      row-key="id"
      :rows-per-page-options="[10, 20, 50]"
      separator="none"
      style="width: 700px;"
      @request="updatePagination"
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
import {Ref, ref, defineProps, watchEffect} from 'vue';
import {i18n} from 'boot/i18n';
import {fetchFtpLogForDevice} from 'src/helpers/api-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';
import {FTPLogEntry} from 'src/data/types/FTPLogEntry';

const props = defineProps({
  cli: {
    type: String,
    required: true
  },
})

/**
 * Updates the table based on user pagination inputs
 * @param {Record<string, string|Record<string, unknown>>} update - update object from quasar table
 * @returns {void} - -
 */
function updatePagination(update: Record<string, string|Record<string, unknown>>){
  pagination.value = update.pagination as Record<string, string|number|boolean>
}

// QTable pagination
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  descending: false,
  sortBy: 'timestamp'
}) as Ref<Record<string, number|boolean|string>>

// ----- Data -----
const columns = [
  { name: 'timestamp', label: i18n.global.t('client_connectivity.date_time'), field: 'timestamp', sortable: false, align: 'center' },
  { name: 'ip', label: i18n.global.t('log_files.ip'), field: 'ip', sortable: false, align: 'center' },
  { name: 'path', label: i18n.global.t('log_files.path'), field: 'path', sortable: false, align: 'center' },
]

const logs = fetchFtpLogForDevice(props.cli, pagination.value)
const rows: Ref<FTPLogEntry[]> = ref([])

watchEffect(() => {
  if(logs.value) {
    pagination.value.rowsNumber = logs.value.total
    rows.value = logs.value.entries
  }
})

</script>
