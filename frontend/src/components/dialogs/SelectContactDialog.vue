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
        dense
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
              {{ props.row.email?.length > 0 ? props.row.email : '-' }}
            </q-td>
            <q-td key="phone">
              {{ props.row.phone?.length > 0 ? props.row.phone : '-' }}
            </q-td>
            <q-td key="event">
              <q-checkbox
                :model-value="props.row.event"
                disable
              />
            </q-td>
            <q-td key="alarm1">
              <q-checkbox
                :model-value="props.row.alarm1"
                disable
              />
            </q-td>
            <q-td key="alarm2">
              <q-checkbox
                :model-value="props.row.alarm2"
                disable
              />
            </q-td>
            <q-td key="smsLimit">
              <q-checkbox
                :model-value="props.row.smsLimit"
                disable
              />
            </q-td>
            <q-td key="power">
              <q-checkbox
                :model-value="props.row.power"
                disable
              />
            </q-td>
            <q-td key="memory">
              <q-checkbox
                :model-value="props.row.memory"
                disable
              />
            </q-td>
            <q-td key="daily">
              <q-checkbox
                :model-value="props.row.daily"
                disable
              />
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
import {deviceType} from 'src/helpers/device-helpers';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

// ----- Data -----
const columns = [
  { name: 'device', label: i18n.global.t('projects.device_type'), field: 'device', sortable: true, align: 'center' },
  { name: 'client', label: i18n.global.t('projects.client'), field: 'cli', sortable: true, align: 'center' },
  { name: 'name', label: i18n.global.t('edit_parameters.name'), field: 'name', sortable: true, align: 'center' },
  { name: 'email', label: i18n.global.t('edit_parameters.email'), field: 'email', sortable: true, align: 'center' },
  { name: 'phone', label: i18n.global.t('edit_parameters.number'), field: 'phone', sortable: true, align: 'center' },
  { name: 'event', label: i18n.global.t('edit_parameters.event'), field: 'event', sortable: true, align: 'center' },
  { name: 'alarm1', label: i18n.global.t('edit_parameters.alarm1'), field: 'alarm1', sortable: true, align: 'center' },
  { name: 'alarm1', label: i18n.global.t('edit_parameters.alarm2'), field: 'alarm2', sortable: true, align: 'center' },
  { name: 'smsLimit', label: i18n.global.t('edit_parameters.sms_limit'), field: 'sms_limit', sortable: true, align: 'center' },
  { name: 'power', label: i18n.global.t('edit_parameters.battery'), field: 'power', sortable: true, align: 'center' },
  { name: 'memory', label: i18n.global.t('edit_parameters.memory'), field: 'memory', sortable: true, align: 'center' },
  { name: 'daily', label: i18n.global.t('edit_parameters.daily'), field: 'daily', sortable: true, align: 'center' },
]

const contacts = myContacts()

/**
 * Upon clicking a row, pick the corresponding contact for copying
 * @param {DeviceContact} row - the clicked contact
 * @returns {void}
 */
function onRowClick(row: DeviceContact){
  onDialogOK(row)
}
</script>
