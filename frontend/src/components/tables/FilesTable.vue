<template>
  <div class="column">
    <!-- Search input -->
    <div class="row" style="justify-content: center">
      <p>
        {{ $t('files.events', {events: lengths.Evt}) }},
        {{ $t('files.peak_files', {peak_files: lengths.Pk}) }},
        {{ $t('files.zip_files', {zip_files: lengths.Zip}) }}
      </p>
    </div>
    <div class="row" style="justify-content: center">
      <q-select
        v-model="search"
        :label="$t('general.filter')"
        :options="[
          {label: $t('files.filter.all'), value: 'All'},
          {label: $t('files.filter.evt'), value: 'Evt'},
          {label: $t('files.filter.pk'), value: 'Pk'},
          {label: $t('files.filter.zip'), value: 'Zip'}]"
        outlined
        dense
        style="width: 90px"
      />
    </div>
    <q-table
      v-model:pagination="pagination"
      class="q-mt-lg"
      flat
      :rows="rows || []"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      @request="updatePagination"
    >
      <template #body="_props">
        <q-tr
          :props="_props"
          @click="() => onRowClick(_props.row)"
        >
          <q-td key="file">
            {{ _props.row.file }}
          </q-td>
          <q-td key="type">
            {{ _props.row.type }}
          </q-td>
          <q-td key="dateTime">
            {{ formatDate(_props.row.dateTime, 'DD.MM.YYYY') }}
          </q-td>
          <q-td key="peakX">
            {{ _props.row.peakX }}
          </q-td>
          <q-td key="peakY">
            {{ _props.row.peakY }}
          </q-td>
          <q-td key="peakZ">
            {{ _props.row.peakZ }}
          </q-td>
          <q-td key="frequencyX">
            {{ _props.row.frequencyX }}
          </q-td>
          <q-td key="frequencyY">
            {{ _props.row.frequencyY }}
          </q-td>
          <q-td key="frequencyZ">
            {{ _props.row.frequencyZ }}
          </q-td>
          <q-td key="VSUM">
            {{ _props.row.VSUM }}
          </q-td>
          <q-td key="fileName">
            <a
              href="#"
              @click.stop="()=>{downloadFile(_props.row.downloadURL)}"
              v-text="_props.row.fileName"
            />
          </q-td>
          <q-td key="preview">
            <a
              href="#"
              @click.stop="()=>{previewFile(_props.row.previewURL)}"
              v-text="_props.row.previewURL ? 'show': ''"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, inject, Ref, ref, watchEffect } from 'vue';
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {date} from 'quasar';
import { fetchEventTableRows } from 'src/helpers/api-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})
const routerService: RouterService|undefined = inject('$routerService')


/**
 * Updates the table based on user pagination inputs
 * @param {Record<string, string|Record<string, unknown>>} update - update object from quasar table
 * @returns {void} - -
 */
function updatePagination(update: Record<string, string|Record<string, unknown>>){
  pagination.value = update.pagination as Record<string, string|number|boolean>
}

const lengths = ref({
  total: 0,
  Zip: 0,
  Evt: 0,
  Pk: 0
})

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  descending: false,
  sortBy: ''
}) as Ref<Record<string, number|boolean|string>>

const rows = ref([]) as Ref<Record<string, unknown>[]>
const search = ref(null)

const events = fetchEventTableRows(props.stationId, pagination.value, search.value)

watchEffect(() => {
  if(events.value){
    pagination.value.rowsNumber = events.value.lengthAll as number
    rows.value = events.value.items as Record<string, unknown>[]
    lengths.value.total = events.value.lengthAll as number
    lengths.value.Pk = events.value.lengthPk as number
    lengths.value.Evt = events.value.lengthEvt as number
    lengths.value.Zip = events.value.lengthZip as number
  }
})

const formatDate = date.formatDate
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


/**
 * Routes to graph page of that event which is clicked
 * @param {Record<string, unknown>} row - the file row that was clicked
 * @returns {Promise<void>} - done
 */
async function onRowClick(row: Record<string, unknown>): Promise<void> {
  await routerService?.addToRoute(row.file as string) // Todo
}

/**
 * Downloads the file which is clicked
 * @param {string} url - URL
 * @returns {void}
 */
async function downloadFile (url: string) {
  await routerService?.routeTo(ROUTES.CUSTOMERS, {url: url}) // ToDo
}

/**
 * Previews the file which is clicked
 * @param {string} url - URL
 * @returns {void}
 */
async function previewFile (url: string) {
  await routerService?.routeTo(ROUTES.CUSTOMERS, {url: url}) // ToDo
}
</script>

<style scoped>

</style>
