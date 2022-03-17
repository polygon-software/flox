<template>
  <p>{{ $t('client_connectivity.title') }}</p>
  <div class="column">
    <!-- Search input -->
    <div class="row" style="justify-content: center">
      <q-input
        v-model="search"
        :label="$t('general.filter')"
        outlined
        type="search"
        dense
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <q-table
      class="q-mt-lg"
      flat
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :filter="search"
      :filter-method="tableFilter"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
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
import {onMounted, Ref, ref, defineProps} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {i18n} from 'boot/i18n';
import {ConnectionLogEntry} from 'src/data/types/ConnectionLogEntry';
import {connectionLogForDevice} from 'src/helpers/api-helpers';
import {formatDateTime} from 'src/helpers/format-helpers';

const props = defineProps({
  cli: {
    type: String,
    required: true
  }
})

const search = ref('')

// Pagination
const skip = ref(0)
const take = ref(10) // Load first 10 entries by default

// ----- Data -----
const columns = [
  { name: 'timestamp', label: i18n.global.t('client_connectivity.date_time'), field: 'timestamp', sortable: true, align: 'center' },
  { name: 'realIp', label: i18n.global.t('client_connectivity.real_ip'), field: 'realIp', sortable: true, align: 'center' },
  { name: 'port', label: i18n.global.t('client_connectivity.port'), field: 'port', sortable: true, align: 'center' },
  { name: 'vpnIp', label: i18n.global.t('client_connectivity.vpn_ip'), field: 'vpnIp', sortable: true, align: 'center' },
  { name: 'event', label: i18n.global.t('client_connectivity.event'), field: 'event', sortable: false, align: 'center' },
]

const rows: Ref<ConnectionLogEntry[]> = ref([])

// Fetch logs on mount
onMounted(async () => {
  await fetchLogs()
})

/**
 * Fetches table contents
 * @returns {Promise<void>} - done
 */
async function fetchLogs(){
  rows.value = await connectionLogForDevice(props.cli, skip.value, take.value)
}

</script>

<style scoped>

</style>
