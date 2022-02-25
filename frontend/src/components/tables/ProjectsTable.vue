<template>
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
      <q-btn
        :label="$t('buttons.new_project')"
        outline
        class="text-grey"
        style="margin-left: 50px"
        @click="createNewProject"
      />
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
          <q-td key="project">
            {{ props.row.project }}
          </q-td>
          <q-td key="device">
            {{ props.row.device }}
          </q-td>
          <q-td key="client">
            {{ props.row.client }}
          </q-td>
          <q-td key="ip">
            {{ props.row.ip }}
          </q-td>
          <q-td key="firmware">
            {{ props.row.firmware }}
          </q-td>
          <q-td key="serial">
            {{ props.row.serial }}
          </q-td>
          <q-td key="sale_status">
            {{ props.row.sale_status }}
          </q-td>
          <q-td key="station">
            {{ props.row.station }}
          </q-td>
          <q-td key="vpn_status">
            {{ props.row.vpn_status }}
          </q-td>
          <q-td key="pid">
            {{ props.row.pid }}
          </q-td>
          <q-td key="files">
            {{ props.row.files }}
          </q-td>
          <q-td key="ftp">
            {{ props.row.ftp }}
          </q-td>
          <q-td key="options">
            <q-btn-dropdown
              dropdown-icon="more_vert"
              auto-close
              no-icon-animation
              flat
              round
              dense
              @click.stop=""
            >
                <!-- Button for options -->
                <q-btn
                  v-for="button in buttons"
                  :key="button.key"
                  :label="button.label"
                  class="column; text-grey"
                  flat
                  no-caps
                  @click="onOptionClick(button.key)"
                />
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {inject, computed, ref} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {MY_PROJECTS} from 'src/data/queries/PROJECT';


const search = ref('')
const routerService: RouterService|undefined = inject('$routerService')

// ----- Data -----
const columns = [
  { name: 'project', label: i18n.global.t('projects.project'), field: 'project', sortable: true, align: 'center' },
  { name: 'device', label: i18n.global.t('projects.device'), field: 'device', sortable: true, align: 'center' },
  { name: 'client', label: i18n.global.t('projects.client'), field: 'client', sortable: true, align: 'center' },
  { name: 'ip', label: i18n.global.t('projects.ip'), field: 'ip', sortable: true, align: 'center' },
  { name: 'firmware', label: i18n.global.t('projects.firmware'), field: 'firmware', sortable: true, align: 'center' },
  { name: 'serial', label: i18n.global.t('projects.serial'), field: 'serial', sortable: true, align: 'center' },
  { name: 'sale_status', label: i18n.global.t('projects.sale_status'), field: 'sale_status', sortable: true, align: 'center' },
  { name: 'station', label: i18n.global.t('projects.station'), field: 'station', sortable: true, align: 'center' },
  { name: 'vpn_status', label: i18n.global.t('projects.vpn_status'), field: 'vpn_status', sortable: true, align: 'center' },
  { name: 'pid', label: i18n.global.t('projects.pid'), field: 'pid', sortable: true, align: 'center' },
  { name: 'files', label: i18n.global.t('projects.files'), field: 'files', sortable: true, align: 'center' },
  { name: 'ftp', label: i18n.global.t('projects.ftp'), field: 'ftp', sortable: true, align: 'center' },
  { name: 'options', label: ' ', field: 'options', sortable: false, align: 'center' },
]


//TODO: uncomment when we have data (and then remove the mocked rows)
/*const userProjects = subscribeToQuery(MY_PROJECTS)

const rows = computed(()=>{
  return userProjects.value ?? []
})*/


const mockedRows = [
  {
    project: 'P1A',
    device: 'MR3000',
    client: '21_45',
    ip: '10.8.13.182',
    firmware: '2.08',
    serial: '87654321',
    sale_status: 'Rental',
    station: 'P1A-A',
    vpn_status: 'Down',
    pid: '0ZAB-21',
    files: '1489',
    ftp: 'Active',
  },
  {
    project: 'P2A',
    device: 'MR4000',
    client: '25_16',
    ip: '10.8.16.16',
    firmware: '220.65',
    serial: '856',
    sale_status: 'Sold',
    station: 'P1A-B',
    vpn_status: 'Up',
    pid: '01-PC-A1',
    files: '27',
    ftp: 'Active',
  },
  {
    project: 'P3A',
    device: 'MR2000',
    client: '45-13',
    ip: '10.8.13.21',
    firmware: '2.2.7',
    serial: '355673',
    sale_status: 'Sold',
    station: 'P2A-A',
    vpn_status: 'Up',
    pid: '3012-21',
    files: '68',
    ftp: 'Active',
  },
  {
    project: 'P4A',
    device: 'MR1000',
    client: '39_21',
    ip: '10.8.13.11',
    firmware: '2.2.3',
    serial: '112456',
    sale_status: 'Sold',
    station: 'P3-A',
    vpn_status: 'Up',
    pid: '3090-121',
    files: '109',
    ftp: 'Active',
  },
]


const buttons = [
  {
    key: 'remove',
    label: i18n.global.t('projects.remove_from_project'),
  },
  {
    key: 'compress',
    label: i18n.global.t('projects.compress_vibration_data'),
  },
  {
    key: 'download',
    label: i18n.global.t('projects.download_compress_vibration_data'),
  },
  {
    key: 'display',
    label: i18n.global.t('projects.display_data'),
  },
  {
    key: 'show_event',
    label: i18n.global.t('projects.show_event'),
  },
  {
    key: 'edit',
    label: i18n.global.t('projects.edit_parameters'),
  },
  {
    key: 'show_status',
    label: i18n.global.t('projects.show_status_files'),
  },
  {
    key: 'show_device',
    label: i18n.global.t('projects.show_device_health'),
  },
]

/**
 * Routes to Create New Project Page or Dialog
 * @async
 * @returns {void}
 */
async function createNewProject(): Promise<void>{
  //TODO: routes to create new project page or dialog
  await routerService?.routeTo(ROUTES.CUSTOMERS)
}

/**
 * Routes to different pages dependent which button is clicked
 * @param {string} key - the button key
 * @returns {Promise<void>} - routes to correct page
 */
async function onOptionClick(key: string): Promise<void>{
  //TODO: routes to different pages
  switch(key){
    case 'remove':
      await routerService?.routeTo(ROUTES.LOGIN)
      break
    case 'compress':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    case 'download':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    case 'display':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    case 'show_event':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    case 'edit':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    case 'show_status':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    case 'show_device':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    default:
      await routerService?.routeTo(ROUTES.CUSTOMER)
  }
}

/**
 * Routes to that project page which is clicked
 * @param {Record<string, unknown>} row - the project row that was clicked
 * @returns {Promise<void>} - done
 */
async function onRowClick(row: Record<string, unknown>): Promise<void> {
  await routerService?.addToRoute(row.project) // or use another value...
}
</script>

<style scoped>
</style>
