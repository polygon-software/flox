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
      <template #body="props">
        <q-tr
          :props="props"
        >
          <q-td key="date_time">
            {{ props.row.date_time }}
          </q-td>
          <q-td key="real_ip">
            {{ props.row.real_ip }}
          </q-td>
          <q-td key="port">
            {{ props.row.port }}
          </q-td>
          <q-td key="vpn_ip">
            {{ props.row.vpn_ip }}
          </q-td>
          <q-td key="event">
            {{ props.row.event }}
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

const props = defineProps({
  cli: {
    type: String,
    required: true
  }
})

const search = ref('')

// ----- Data -----
const columns = [
  { name: 'date_time', label: i18n.global.t('client_connectivity.date_time'), field: 'date_time', sortable: true, align: 'center' },
  { name: 'real_ip', label: i18n.global.t('client_connectivity.real_ip'), field: 'real_ip', sortable: true, align: 'center' },
  { name: 'port', label: i18n.global.t('client_connectivity.port'), field: 'port', sortable: true, align: 'center' },
  { name: 'vpn_ip', label: i18n.global.t('client_connectivity.vpn_ip'), field: 'vpn_ip', sortable: true, align: 'center' },
  { name: 'event', label: i18n.global.t('client_connectivity.event'), field: 'event', sortable: false, align: 'center' },
]

const rows: Ref<ConnectionLogEntry[]> = ref([])

// Fetch logs on mount
onMounted(async () => {
  rows.value = await connectionLogForDevice(props.cli)
})

</script>

<style scoped>

</style>
