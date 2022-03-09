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
            {{ props.row.project?.name ?? '-' }}
          </q-td>
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
            {{ props.row.saleStatus }}
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
                  @click="onOptionClick(props.row.project, props.row.cli, button.key)"
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
import {useQuasar} from 'quasar';
import {tableFilter} from 'src/helpers/filter-helpers';
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import CreateProjectDialog from 'src/components/dialogs/CreateProjectDialog.vue'
import {myProjectDevices} from 'src/helpers/api-helpers';
import {Device} from 'src/data/types/Device';
import {showNotification} from 'src/helpers/notification-helpers';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {REMOVE_DEVICE_FROM_PROJECT} from 'src/data/mutations/PROJECT';
import {Project} from 'src/data/types/Project';

const $q = useQuasar()


const search = ref('')
const routerService: RouterService|undefined = inject('$routerService')

// ----- Data -----
const columns = [
  { name: 'project', label: i18n.global.t('projects.project'), field: 'project', sortable: true, align: 'center' },
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
  { name: 'options', label: ' ', field: 'options', sortable: false, align: 'center' },
]

const rows: Ref<Device[]> = ref([])

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
    key: 'device_health',
    label: i18n.global.t('projects.show_device_health'),
  },
]

// Once mounted, fetch data
onMounted(async () => {
  rows.value = await myProjectDevices()
})

/**
 * Shows a dialog for creating a new project
 * @async
 * @returns {void}
 */
async function createNewProject(): Promise<void> { //TODO: Add different dialog for admin
  $q.dialog({
    component: CreateProjectDialog,
  }).onOk(() => {
    // Show success notification
    showNotification(
      $q,
      i18n.global.t('messages.project_created'),
      'bottom',
      'positive',
    )
  })
  await routerService?.routeTo(ROUTES.CUSTOMERS)
}

/**
 * Routes to different pages dependent which button is clicked$
 * @param {Project} project - the Project
 * @param {string} device - the device's CLI
 * @param {string} key - the button key
 * @returns {Promise<void>} - routes to correct page
 */
async function onOptionClick(project: Project, device: string, key: string): Promise<void>{
  console.log('onoptionclick', device)
  //TODO: routes to different pages
  switch(key){
    // Removing device from project: Show warning dialog
    case 'remove':
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: i18n.global.t('warnings.unassign_device'),
          showDiscard: true,
          discardLabel: i18n.global.t('buttons.cancel'),
          swapNegative: true,
          okLabel: i18n.global.t('buttons.confirm')
        }
      }).onOk(() => {
        void executeMutation(REMOVE_DEVICE_FROM_PROJECT, {uuid: project.uuid, cli: device}).then(() => {
          // Show success notification
          showNotification(
            $q,
            i18n.global.t('messages.removed_device'),
            'bottom',
            'positive',
          )
        })
      })
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
      await routerService?.addToRoute(`${project.name}/${device}/${key}`)
      break
    case 'edit':
      await routerService?.addToRoute(`${project.name}/${device}/${key}`)
      break
    case 'status':
      await routerService?.addToRoute(`${project.name}/${device}/${key}`)
      break
    case 'device_health':
      await routerService?.addToRoute(`${project.name}/${device}/${key}`)
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
  await routerService?.addToRoute(row.project.name as string)
}
</script>

<style scoped>
</style>
