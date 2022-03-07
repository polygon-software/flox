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
      :rows="rows || []"
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
          <q-td key="dateTime">
            {{ props.row.dateTime }}
          </q-td>
          <q-td key="peakX">
            {{ props.row.peakX }}
          </q-td>
          <q-td key="peakY">
            {{ props.row.peakY }}
          </q-td>
          <q-td key="peakZ">
            {{ props.row.peakZ }}
          </q-td>
          <q-td key="frequencyX">
            {{ props.row.frequencyX }}
          </q-td>
          <q-td key="frequencyY">
            {{ props.row.frequencyY }}
          </q-td>
          <q-td key="frequencyZ">
            {{ props.row.frequencyZ }}
          </q-td>
          <q-td key="VSUM">
            {{ props.row.VSUM }}
          </q-td>
          <q-td key="fileName">
            <a
              href="#"
              @click.stop="()=>{downloadFile(props.row.downloadURL)}"
              v-text="props.row.fileName"
            />
          </q-td>
          <q-td key="preview">
            <a
              href="#"
              @click.stop="()=>{preview(props.row.previewURL)}"
              v-text="props.row.previewURL ? 'show': ''"
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
  { name: 'dateTime', label: i18n.global.t('files.date_time'), field: 'dateTime', sortable: true, align: 'center' },
  { name: 'peakX', label: i18n.global.t('files.peak_x'), field: 'peakX', sortable: true, align: 'center' },
  { name: 'peakY', label: i18n.global.t('files.peak_y'), field: 'peakY', sortable: true, align: 'center' },
  { name: 'peakZ', label: i18n.global.t('files.peak_z'), field: 'peakZ', sortable: true, align: 'center' },
  { name: 'frequencyX', label: i18n.global.t('files.frq_x'), field: 'frequencyX', sortable: true, align: 'center' },
  { name: 'frequencyY', label: i18n.global.t('files.frq_y'), field: 'frequencyY', sortable: true, align: 'center' },
  { name: 'frequencyZ', label: i18n.global.t('files.frq_z'), field: 'frequencyZ', sortable: true, align: 'center' },
  { name: 'VSUM', label: i18n.global.t('files.vsum'), field: 'VSUM', sortable: true, align: 'center' },
  { name: 'downloadURL', label: i18n.global.t('files.downloadURL'), field: 'downloadURL', sortable: false, align: 'center' },
  { name: 'previewURL', label: i18n.global.t('files.previewURL'), field: 'previewURL', sortable: false, align: 'center' },
]

const rows = subscribeToQuery(EVENT_TABLE_ROWS, {stationId: '44_08'})

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
