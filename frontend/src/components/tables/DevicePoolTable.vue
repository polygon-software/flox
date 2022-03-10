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
          <q-td key="device">
            {{ props.row.type }}
          </q-td>
          <q-td key="client">
            {{ props.row.cli }}
          </q-td>
          <q-td key="ip">
            {{ props.row.ip }}
          </q-td>
          <q-td key="firmware">
            {{ props.row.firmware }}
          </q-td>
          <q-td key="serial">
            {{ props.row.serialNumber }}
          </q-td>
          <q-td key="sale_status">
            {{ props.row.sale_status }}
          </q-td>
          <q-td key="station">
            {{ props.row.name }}
          </q-td>
          <q-td key="vpn_status">
            {{ props.row.ip.length > 1 ? $t('status.up') : $t('status.down') }}
          </q-td>
          <q-td key="pid">
            {{ props.row.pid }}
          </q-td>
          <q-td key="files">
            {{ props.row.files }}
          </q-td>
          <q-td key="ftp">
            {{ $t(props.row.ftp ? 'general.yes' : 'general.no')}}
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
                  class="text-grey full-width"
                  align="left"
                  style="display: flex; flex-direction: column"
                  flat
                  no-caps
                  @click="onOptionClick(props.row.cli, button.key)"
                />
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, Ref, ref} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {myPoolDevices} from 'src/helpers/api-helpers';
import {Device} from 'src/data/types/Device';
import AssignToProjectDialog from 'components/dialogs/AssignToProjectDialog.vue';
import {useQuasar} from 'quasar';
import {showNotification} from 'src/helpers/notification-helpers';
import {assignDeviceToProject} from 'src/helpers/project-helpers';

const search = ref('')
const routerService: RouterService|undefined = inject('$routerService')
const rows: Ref<Device[]> = ref([])
const $q = useQuasar()

// ----- Data -----
const columns = [
  { name: 'device', label: i18n.global.t('projects.device_type'), field: 'device', sortable: true, align: 'center' },
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
]


const buttons = [
  {
    key: 'assign',
    label: i18n.global.t('projects.assign_to_project'),
  },
  {
    key: 'status',
    label: i18n.global.t('projects.show_status_files'),
  },
  {
    key: 'device_health',
    label: i18n.global.t('projects.show_device_health'),
  },
]

// Once mounted, fetch data
onMounted(async () => {
  rows.value = await myPoolDevices()
})

/**
 * Routes to different pages dependent which button is clicked
 * @param {string} device - the CLI of a device
 * @param {string} key - the button key
 * @returns {Promise<void>} - routes to correct page
 */
async function onOptionClick(device: string, key: string): Promise<void>{
  //TODO: routes to different pages
  switch(key){
    case 'assign':
      assignDeviceToProject($q, device)
      break
    case 'status':
      await routerService?.addToRoute(`pool/${device}/${key}`)
      break
    case 'device_health':
      await routerService?.addToRoute(`pool/${device}/${key}`)
      break
    default:
      await routerService?.routeTo(ROUTES.CUSTOMERS)
  }
}
</script>

<style scoped>

</style>
