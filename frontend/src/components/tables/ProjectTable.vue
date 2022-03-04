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
        :label="$t('buttons.custom_graph')"
        outline
        class="text-grey"
        style="margin-left: 50px"
        :disable="selectedRows.length === 0"
        @click="() => showCustomGraph(selectedRows)"
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
          @click="() => showCustomGraph([props.row.name])"
        >
          <q-td key="checkbox">
            <q-checkbox
              v-model="selectedRows"
              :val="props.row.name"
            />
          </q-td>
          <q-td key="name">
            {{ props.row.name }}
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
                  class="text-grey"
                  style="display: flex; flex-direction: column"
                  flat
                  no-caps
                  @click="onOptionClick(props.row.name, button.key)"
                />
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {inject, Ref, ref} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

const search = ref('')
const routerService: RouterService|undefined = inject('$routerService')

const selectedRows: Ref<string[]> = ref([])

// ----- Data -----
const columns = [
  { name: 'checkbox', label: ' ', field: 'checkbox', sortable: false, align: 'center' },
  { name: 'name', label: i18n.global.t('projects.name'), field: 'name', sortable: true, align: 'center' },
  { name: 'device', label: i18n.global.t('projects.device'), field: 'device', sortable: true, align: 'center' },
  { name: 'client', label: i18n.global.t('projects.client'), field: 'client', sortable: true, align: 'center' },
  { name: 'ip', label: i18n.global.t('projects.ip'), field: 'ip', sortable: true, align: 'center' },
  { name: 'firmware', label: i18n.global.t('projects.firmware'), field: 'firmware', sortable: true, align: 'center' },
  { name: 'serial', label: i18n.global.t('projects.serial'), field: 'serial', sortable: true, align: 'center' },
  { name: 'sale_status', label: i18n.global.t('projects.sale_status'), field: 'sale_status', sortable: true, align: 'center' },
  { name: 'vpn_status', label: i18n.global.t('projects.vpn_status'), field: 'vpn_status', sortable: true, align: 'center' },
  { name: 'pid', label: i18n.global.t('projects.pid'), field: 'pid', sortable: true, align: 'center' },
  { name: 'files', label: i18n.global.t('projects.files'), field: 'files', sortable: true, align: 'center' },
  { name: 'ftp', label: i18n.global.t('projects.ftp'), field: 'ftp', sortable: true, align: 'center' },
  { name: 'options', label: ' ', field: 'options', sortable: false, align: 'center' },
]

const rows = [
  {
    name: 'P1A-A',
    device: 'MR3000',
    client: '21_45',
    ip: '10.8.13.182',
    firmware: '2.08',
    serial: '87654321',
    sale_status: 'Rental',
    vpn_status: 'Down',
    pid: '0ZAB-21',
    files: '1489',
    ftp: 'Active',
  },
  {
    name: 'P1A-B',
    device: 'MR2000',
    client: '25_16',
    ip: '10.8.16.16',
    firmware: '220.65',
    serial: '856',
    sale_status: 'Sold',
    vpn_status: 'Up',
    pid: '01-PC-A1',
    files: '27',
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
    key: 'files',
    label: i18n.global.t('projects.show_event'),
  },
  {
    key: 'edit',
    label: i18n.global.t('projects.edit_parameters'),
  },
  {
    key: 'status',
    label: i18n.global.t('projects.show_status_files'),
  },
  {
    key: 'show_device',
    label: i18n.global.t('projects.show_device_health'),
  },
]

/**
 * Routes to a new page where the graph of that project is shown
 * @param {string[]} devices - names of devices to show the graph for
 * @returns {Promise<void>} - done
 */
async function showCustomGraph(devices: string[]): Promise<void>{
  // TODO: once we have actual data, prepend a popup here for choosing timeframe/etc options (see Figma)

  // Build string combination of device CLIs
  let pathSuffix = ''
  devices.forEach((device) => {
    pathSuffix += `${device}+`
  })

  // Subtract last '+'
  pathSuffix = pathSuffix.substring(0, pathSuffix.length-1)

  await routerService?.addToRoute(pathSuffix)
}

/**
 * Routes to different pages dependent which button is clicked
 * @param {string} device - the name of a device
 * @param {string} key - the button key
 * @returns {Promise<void>} - routes to correct page
 */
async function onOptionClick(device: string, key: string): Promise<void>{
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
    case 'files':
      await routerService?.addToRoute(`${device}/${key}`)
      break
    case 'edit':
      await routerService?.addToRoute(`${device}/${key}`)
      break
    case 'status':
      await routerService?.addToRoute(`${device}/${key}`)
      break
    case 'show_device':
      await routerService?.routeTo(ROUTES.CUSTOMER)
      break
    default:
      await routerService?.routeTo(ROUTES.CUSTOMER)
  }
}
</script>

<style scoped>

</style>
