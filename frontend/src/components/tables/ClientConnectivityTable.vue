<template>
  <strong>{{ $t('client_connectivity.title') }}</strong>
  <div class="column">
    <q-table
      v-model:pagination="pagination"
      class="q-mt-lg"
      :rows="rows"
      flat
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[10]"
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
import {Ref, ref, defineProps, watch} from 'vue';
import {i18n} from 'boot/i18n';
import {fetchConnectionLogForDevice, fetchDeviceConnectionLogCount} from 'src/helpers/api-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';

const props = defineProps({
  cli: {
    type: String,
    required: true
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
  { name: 'realIp', label: i18n.global.t('client_connectivity.real_ip'), field: 'realIp', sortable: false, align: 'center' },
  { name: 'port', label: i18n.global.t('client_connectivity.port'), field: 'port', sortable: false, align: 'center' },
  { name: 'vpnIp', label: i18n.global.t('client_connectivity.vpn_ip'), field: 'vpnIp', sortable: false, align: 'center' },
  { name: 'event', label: i18n.global.t('client_connectivity.event'), field: 'event', sortable: false, align: 'center' },
]

const rows = fetchConnectionLogForDevice(props.cli, pagination.value)

// ComputedRef for total row count
const rowsNumber = fetchDeviceConnectionLogCount(props.cli)

// Update if new number of rows detected
watch(rowsNumber, (newVal) => {
  // Get total row count (for pagination)
  pagination.value.rowsNumber = newVal
})

</script>
