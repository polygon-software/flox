<template>
  <div class="column">
    <!-- Search input -->
    <div class="row" style="justify-content: center">
      <p>{{ $t('files.events', {events: events}) }}, {{ $t('files.peak_files', {peak_files: peakFiles}) }},
        {{ $t('files.zip_files', {zip_files: zipFiles}) }}, {{ $t('files.totally_files', {files: files, total_files: totalFiles}) }}</p>
    </div>
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
          @click="() => onRowClick(props.row)"
        >
          <q-td key="file">
            {{ props.row.file }}
          </q-td>
          <q-td key="type">
            {{ props.row.type }}
          </q-td>
          <q-td key="date_time">
            {{ props.row.date_time }}
          </q-td>
          <q-td key="peak_x">
            {{ props.row.peak_x }}
          </q-td>
          <q-td key="peak_y">
            {{ props.row.peak_y }}
          </q-td>
          <q-td key="peak_z">
            {{ props.row.peak_z }}
          </q-td>
          <q-td key="frq_x">
            {{ props.row.frq_x }}
          </q-td>
          <q-td key="frq_y">
            {{ props.row.frq_y }}
          </q-td>
          <q-td key="frq_z">
            {{ props.row.frq_z }}
          </q-td>
          <q-td key="vsum">
            {{ props.row.vsum }}
          </q-td>
          <q-td key="download">
            <a
              href="#"
              @click.stop="downloadFile"
              v-text="props.row.download"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {EVENT_TABLE_ROWS} from 'src/data/queries/DEVICE';

// TODO: take data from database
const events = ref(12)
const peakFiles = ref(12)
const zipFiles = ref(1)
const files = ref(600)
const totalFiles = ref(788)
const search = ref('')

const routerService: RouterService|undefined = inject('$routerService')

// ----- Data -----
const columns = [
  { name: 'file', label: i18n.global.t('files.file'), field: 'file', sortable: true, align: 'center' },
  { name: 'type', label: i18n.global.t('files.type'), field: 'type', sortable: true, align: 'center' },
  { name: 'date_time', label: i18n.global.t('files.date_time'), field: 'date_time', sortable: true, align: 'center' },
  { name: 'peak_x', label: i18n.global.t('files.peak_x'), field: 'peak_x', sortable: true, align: 'center' },
  { name: 'peak_y', label: i18n.global.t('files.peak_y'), field: 'peak_y', sortable: true, align: 'center' },
  { name: 'peak_z', label: i18n.global.t('files.peak_z'), field: 'peak_z', sortable: true, align: 'center' },
  { name: 'frq_x', label: i18n.global.t('files.frq_x'), field: 'frq_x', sortable: true, align: 'center' },
  { name: 'frq_y', label: i18n.global.t('files.frq_y'), field: 'frq_y', sortable: true, align: 'center' },
  { name: 'frq_z', label: i18n.global.t('files.frq_z'), field: 'frq_z', sortable: true, align: 'center' },
  { name: 'vsum', label: i18n.global.t('files.vsum'), field: 'vsum', sortable: true, align: 'center' },
  { name: 'download', label: i18n.global.t('files.download'), field: 'download', sortable: false, align: 'center' },
]

subscribeToQuery(EVENT_TABLE_ROWS, {stationId: '44_08'})

// TODO: take data from database
const rows = [
  {
    file: '2',
    type: 'Evt',
    date_time: '2022-02-28 10:39:43',
    peak_x: '0.161 mm/s',
    peak_y: '0.713 mm/s',
    peak_z: '0.076 mm/s',
    frq_x: '90.1',
    frq_y: '15.8',
    frq_z: '15.8',
    vsum: '0.72',
    download: '22059002.XMR',
  },
  {
    file: '50',
    type: 'Pk',
    date_time: '2022-02-27 09:25:45',
    peak_x: '0.049 mm/s',
    peak_y: '0.064 mm/s',
    peak_z: '0.875 mm/s',
    frq_x: '99.8',
    frq_y: '17.2',
    frq_z: '17.9',
    vsum: '0.88',
    download: '22059001.XMR',
  },
]

/**
 * Routes to graph page of that event which is clicked
 * @param {Record<string, unknown>} row - the file row that was clicked
 * @returns {Promise<void>} - done
 */
async function onRowClick(row: Record<string, unknown>): Promise<void> {
  await routerService?.addToRoute(row.file) // or use another value...
}

// TODO: replace it to download the file
/**
 * Downloads the file which is clicked
 * @returns {void}
 */
async function downloadFile () {
  await routerService?.routeTo(ROUTES.CUSTOMERS)
}
</script>

<style scoped>

</style>
