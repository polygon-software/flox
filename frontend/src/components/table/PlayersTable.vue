<template>
  <div class="column full-width">
    <q-table
      :rows="computedResult"
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
            {{ _props.row.birthdate ? formatDate(new Date(_props.row.birthdate)) : '-' }}
          </q-td>
          <q-td key="options" :props="_props">
            <q-btn-dropdown
              dropdown-icon="more_vert"
              auto-close
              no-icon-animation
              flat
              round
              dense
              @click="showOptions = !showOptions"
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
                  @click="() => disableUser(_props.row)"
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
                  @click="() => enableUser(_props.row)"
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
import {computed, defineProps, Ref} from 'vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {USER_STATUS} from '../../../../shared/definitions/ENUM';
import {i18n} from 'boot/i18n';
import {ALL_PLAYERS} from 'src/data/queries/USER';
import {useQuasar} from 'quasar';
import EnableUserDialog from 'components/dialogs/EnableUserDialog.vue';
import {showNotification} from 'src/helpers/notification-helpers';
import {DISABLE_USER, ENABLE_USER} from 'src/data/mutations/USER';

const $q = useQuasar()


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

// TODO i18n
const columns = [
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'center' },
  { name: 'username', label: 'Username', field: 'username', sortable: true, align: 'center' },
  { name: 'fullName', label: 'Full Name', field: 'fullName', sortable: true, align: 'center' },
  { name: 'email', label: 'E-Mail', field: 'email', sortable: true, align: 'center' },
  { name: 'phone', label: 'Phone', field: 'phone', sortable: true, align: 'center' },
  { name: 'birthdate', label: 'Date of Birth', field: 'birthdate', sortable: true, align: 'center' },
  { name: 'options', label: '', field: 'options', sortable: false, align: 'center'},
]

const queryResult = subscribeToQuery(ALL_PLAYERS) as Ref<Array<Record<string, unknown>>>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  return queryResult.value ?? []
})

/**
 * Disables a given user's account
 * @param {Record<string, unknown>} user - the user to disable
 * @returns {Promise<void>} - if the user was disabled
 */
function disableUser(user: Record<string, unknown>): void{
  // Enable account on backend
  executeMutation(
    DISABLE_USER,
    {
      uuid: user.uuid
    }
  ).then(() => {
    // Show confirmation prompt
    showNotification(
      $q,
      i18n.global.t('messages.account_disabled'),
      undefined,
      'negative'
    )
  }).catch(() => {
    // Show error prompt
    showNotification(
      $q,
      i18n.global.t('errors.error_while_disabling'),
      undefined,
      'negative'
    )
  })
}

/**
 * Opens a dialog for enabling a user's account
 * @param {Record<string, unknown>} user - the user to enable
 * @returns {Promise<void>} - if the user was enabled
 */
function enableUser(user: Record<string, unknown>): void{
  $q.dialog({
    component: EnableUserDialog,
    componentProps: {
      user: user
    }
  }).onOk(() => {
    // Enable account on backend
    executeMutation(
      ENABLE_USER,
      {
        uuid: user.uuid
      }
    ).then(() => {
      // Show confirmation prompt
      showNotification(
        $q,
        i18n.global.t('messages.account_enabled'),
        undefined,
        'positive'
      )
    }).catch(() => {
      // Show error prompt
      showNotification(
        $q,
        i18n.global.t('errors.error_while_enabling'),
        undefined,
        'negative'
      )
    })
  })
}

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

</script>
