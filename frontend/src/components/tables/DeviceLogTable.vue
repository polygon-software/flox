<template>
  <strong class="q-mt-lg">
    {{ title }}
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
          <q-td key="message">
            {{ _props.row.message }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {Ref, ref, defineProps, watchEffect} from 'vue';
import {i18n} from 'boot/i18n';
import {fetchLogForDevice} from 'src/helpers/api-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';
import {DeviceLogEntry} from 'src/data/types/DeviceLogEntry';

const props = defineProps({
  cli: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false,
    default: i18n.global.t('log_files.log_file')
  },
  // Log request type (e.g. 'REST)
  type: {
    type: String,
    required: false,
    default: null
  }
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
  { name: 'message', label: i18n.global.t('log_files.message'), field: 'message', sortable: false, align: 'center' },
]

const logs = fetchLogForDevice(props.cli, pagination.value, props.type)
const rows: Ref<DeviceLogEntry[]> = ref([])

watchEffect(() => {
  if(logs.value){
    pagination.value.rowsNumber = logs.value.total
    rows.value = logs.value.entries
  }
})


</script>
