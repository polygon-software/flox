<template>
  <q-dialog
    ref="dialogRef"
    :no-backdrop-dismiss="true"
  >
    <q-card class="q-pa-sm">
      <h5 style="text-align: center">
        {{ $t('edit_parameters.copy_contact') }}
      </h5>

      <!-- Contacts title -->
      <q-table
        class="q-mt-lg"
        :rows="contacts"
        :columns="columns"
        row-key="uuid"
        :rows-per-page-options="[10,20, 100]"
        separator="none"
        flat
      >
        <template #body="props">
          <q-tr
            :props="props"
            @click="() => onRowClick(props.row)"
          >
            <q-td key="device">
              {{ deviceType(props.row.cli) }}
            </q-td>
            <q-td key="client">
              {{ props.row.cli }}
            </q-td>
            <q-td key="name">
              {{ props.row.name }}
            </q-td>
            <q-td key="email">
              {{ props.row.email }}
            </q-td>
            <q-td key="phone">
              {{ props.row.phone }}
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <q-card-actions align="center">
        <q-btn
          :label="$t('buttons.cancel')"
          outline
          class="text-grey"
          @click="onDialogCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import {myContacts} from 'src/helpers/api-helpers';
import {i18n} from 'boot/i18n';
import {DeviceContact} from 'src/data/types/DeviceContact';
import {ref, Ref} from 'vue';
import {deviceType} from 'src/helpers/device-helpers';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// ----- Data -----
const columns = [
  { name: 'device', label: i18n.global.t('projects.device_type'), field: 'device', sortable: true, align: 'center' },
  { name: 'client', label: i18n.global.t('projects.client'), field: 'cli', sortable: true, align: 'center' },
  { name: 'name', label: i18n.global.t('edit_parameters.name'), field: 'name', sortable: true, align: 'center' },
  { name: 'email', label: i18n.global.t('edit_parameters.email'), field: 'email', sortable: true, align: 'center' },
  { name: 'phone', label: i18n.global.t('edit_parameters.number'), field: 'phone', sortable: true, align: 'center' },
]

const contacts = myContacts()
const selectedContact: Ref<DeviceContact|null> = ref(null)

/**
 * Upon clicking a row, pick the corresponding contact for copying
 * @param {DeviceContact} row - the clicked contact
 * @returns {void}
 */
function onRowClick(row: DeviceContact){
  console.log('SELECT', row)
  // TODO
}
</script>
