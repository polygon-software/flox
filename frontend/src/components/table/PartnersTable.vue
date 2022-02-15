<template>
  <div class="column full-width">
    <q-table
      :rows="allPartners"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      :filter="search"
      flat
      bordered
    >
      <template #body="_props">
        <q-tr
          v-if="statusFilter ? _props.row.status === statusFilter : true"
          :props="_props"
          class="q-ma-none q-pa-none"
          style="cursor: pointer"
        >
          <q-td key="status" :props="_props">
            <q-chip
              :label=getStatusChip(_props.row.status).label
              :color="getStatusChip(_props.row.status).color"
              text-color="white"
              style="font-weight: bold"
            />
          </q-td>
          <q-td key="username" :props="_props">
            {{ _props.row.username}}
          </q-td>
          <q-td key="fullName" :props="_props">
            {{ _props.row.fullName}}
          </q-td>
          <q-td key="email" :props="_props">
            {{ _props.row.email}}
          </q-td>
          <q-td key="phone" :props="_props">
            {{ _props.row.phone}}
          </q-td>
          <q-td key="birthdate" :props="_props">
            {{ _props.row.birthdate ? formatDate(_props.row.birthdate) : '-' }}
          </q-td>
          <q-td key="options" :props="_props">
            <q-btn-dropdown
              dropdown-icon="more_vert"
              auto-close
              no-icon-animation
              flat
              round
              dense
              @click.stop="showOptions = !showOptions"
            >
              <div class="column">
                <!-- 'Disable' button for active accounts -->
                <q-btn
                  v-if="_props.row.status === USER_STATUS.ACTIVE"
                  :label="$t('admin.disable_account')"
                  icon="block"
                  class="text-black"
                  flat
                  no-caps
                  @click="disableUser(_props.row)"
                />

                <!-- 'Enable'/'Re-enable' button for inactive accounts -->
                <q-btn
                  v-else
                  :label="$t(
                    _props.row.status === USER_STATUS.DISABLED ?
                    'admin.re_enable_account'
                    :
                    'admin.enable_account'
                    )"
                  icon="lock_open"
                  class="text-black"
                  flat
                  no-caps
                  @click="enableUser(_props.row)"
                />
              </div>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, inject } from 'vue';
import { formatDate } from 'src/helpers/format-helpers';
import { USER_STATUS } from '../../../../shared/definitions/ENUM';
import { i18n } from 'boot/i18n';
import { DialogService } from 'src/services/DialogService';
import { fetchAllPartners } from 'src/helpers/api-helpers';
import { User } from 'src/data/types/User';

const dialogService: DialogService|undefined = inject('$dialogService')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps( {
  search: {
    required: true,
    type: String,
  },
  statusFilter: {
    required: false,
    default: null,
    type: String,
  }
})

const columns = [
  { name: 'status', label: i18n.global.t('admin.status'), field: 'status', sortable: true, align: 'center' },
  { name: 'username', label: i18n.global.t('account_data.username'), field: 'username', sortable: true, align: 'center' },
  { name: 'fullName', label: i18n.global.t('account_data.full_name'), field: 'fullName', sortable: true, align: 'center' },
  { name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: true, align: 'center' },
  { name: 'phone', label: i18n.global.t('account_data.phone_number'), field: 'phone', sortable: true, align: 'center' },
  { name: 'birthdate', label: i18n.global.t('account_data.birthdate'), field: 'birthdate', sortable: true, align: 'center' },
  { name: 'options', field: 'options', sortable: false, align: 'center'},
]

const allPartners = fetchAllPartners();

/**
 * Gets the color & label for the status chip of a user
 * @param {USER_STATUS} status - the user's status
 * @returns {Record<string, string>} - object containing color and label
 */
function getStatusChip(status: USER_STATUS): Record<string,unknown>|null {
  switch(status){
    case USER_STATUS.APPLIED:
      // Applied
      return {
        label: i18n.global.t('user_status.applied'),
        color: 'neutral'
      }
    case USER_STATUS.ACTIVE:
      // Active
      return {
        label: i18n.global.t('user_status.active'),
        color: 'positive'
      }
    case USER_STATUS.DISABLED:
      // Disabled
      return {
        label: i18n.global.t('user_status.disabled'),
        color: 'negative'
      }
    default:
      return {
        label: '-',
        color: null
      }
  }
}

/**
 * Open enableUser dialog
 * @param {User} user - user
 * @returns {void} - void
 */
function enableUser(user: User){
  dialogService?.enableUser(user)
}

/**
 * Open disableUser dialog
 * @param {User} user - user
 * @returns {void} - void
 */
function disableUser(user: User){
  dialogService?.disableUser(user)
}
</script>
