<template>
  <div class="column">
    <!-- Search input -->
    <div class="row" style="justify-content: center">
      <p>{{ $t('files.events', {events: lenghts.Evt}) }}, {{ $t('files.peak_files', {peak_files: lenghts.Pk}) }},
        {{ $t('files.zip_files', {zip_files: lenghts.Zip}) }}</p>
    </div>
    <div class="row" style="justify-content: center">
      <q-select
        v-model="search"
        :label="$t('general.filter')"
        :options="['All', 'Evt', 'Pk', 'Zip']"
        outlined
        dense
        style="width: 90px"
        @update:model-value="refetch"
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
            {{ formatDate(props.row.dateTime, 'DD.MM.YYYY') }}
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
import {defineProps, inject, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {executeQuery} from 'src/helpers/data-helpers';
import {EVENT_TABLE_ROWS} from 'src/data/queries/DEVICE';
import {date} from 'quasar';

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
  pagination.value = update.pagination as Record<string, unknown>
  return refetch()
}

/**
 * Fetch events
 * @returns {Promise<void>} - done
 */
async function refetch(): Promise<void>{
  const res = await executeQuery(EVENT_TABLE_ROWS, {
    stationId: props.stationId,
    skip: (pagination.value.page as number - 1) * (pagination.value.rowsPerPage as number),
    take: pagination.value.rowsPerPage as number,
    filter: search.value,
    orderBy: (pagination.value.sortBy as string) || 'date_time',
    descending: pagination.value.descending as boolean || false
  });
  const fetchRes = res.data[EVENT_TABLE_ROWS.cacheLocation] as Record<string, Record<string, unknown>[]|number>
  pagination.value.rowsNumber = fetchRes.lengthAll
  rows.value = fetchRes.items as Record<string, unknown>[]
  lenghts.value.total = fetchRes.lengthAll as number
  lenghts.value.Pk = fetchRes.lengthPk as number
  lenghts.value.Evt = fetchRes.lengthEvt as number
  lenghts.value.Zip = fetchRes.lengthZip as number

}
const lenghts = ref({
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
}) as Ref<Record<string, unknown>>

const rows = ref([]) as Ref<Record<string, unknown>[]>
const search = ref(null)

void refetch()

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
  await routerService?.addToRoute(row.file) // Todo
}

// TODO: replace it to download the file
/**
 * Downloads the file which is clicked
 * @returns {void}
 */
async function downloadFile () {
  await routerService?.routeTo(ROUTES.CUSTOMERS) // ToDo
}
</script>

<style scoped>

</style>
