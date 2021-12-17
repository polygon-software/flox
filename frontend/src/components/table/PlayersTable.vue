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
      <template #body="props">
        <q-tr
          v-if="statusFilter ? props.row.status === statusFilter : true"
          :props="props"
          class="q-ma-none q-pa-none"
          style="cursor: pointer"
        >
          <q-td key="status" :props="props">
            <q-chip
              :label=getStatusChip(props.row.status).label
              :color="getStatusChip(props.row.status).color"
              text-color="white"
              style="font-weight: bold"
            />
          </q-td>
          <q-td key="username" :props="props">
            {{ props.row.username}}
          </q-td>
          <q-td key="fullName" :props="props">
            {{ props.row.fullName}}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email}}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone}}
          </q-td>
          <q-td key="birthdate" :props="props">
            {{ props.row.birthdate ? formatDate(new Date(props.row.birthdate)) : '-' }}
          </q-td>
          <q-td key="options" :props="props">
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
                <!-- Disable button -->
                <q-btn
                  :label="$t('general.disable')"
                  icon="edit"
                  class="text-black"
                  flat
                  no-caps
                  @click="() => disableUser(props.row)"
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
import {computed, defineProps, inject, Ref} from 'vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {PRODUCT_STATUS, USER_STATUS} from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {useQuasar} from 'quasar';
import {FetchResult} from '@apollo/client';
import {sleep} from 'src/helpers/general-helpers';
import {i18n} from 'boot/i18n';
import {ALL_PLAYERS} from 'src/data/queries/USER';

const $routerService: RouterService|undefined = inject('$routerService')
const $q = useQuasar()

const props = defineProps( {
  search: {
    required: true,
    type: String,
  },
  statusFilter: {
    required: false,
    type: String,
  }
})

// TODO i18n
const columns = [
  { name: 'pictures', label: '', field: 'uuid', sortable: false, align: 'center'},
  { name: 'title', label: 'Product', field: 'title', sortable: true, align: 'center' },
  { name: 'brand', label: 'Brand', field: 'brand', sortable: true, align: 'center' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'center' },
  { name: 'sponsored', label: 'Type', field: 'sponsored', sortable: true, align: 'center' },
  { name: 'start', label: 'Start Date', field: 'start', sortable: true, align: 'center' },
  { name: 'tags', label: '', field: 'tags', sortable: false }, // Invisible column, used for filtering only
  { name: 'options', label: '', field: 'options', sortable: false, align: 'center'},
]

const queryResult = subscribeToQuery(ALL_PLAYERS) as Ref<Array<Record<string, unknown>>>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  return queryResult.value ?? []
})

/**
 * TODO docs
 * @param {Record<string, unknown>} user - the user to disable
 * @returns {Promise<void>} - if the user was disabled
 */
async function disableUser(user: Record<string, unknown>): Promise<void>{
  // TODO actual functionality
  // await $routerService?.routeTo(
  //   ROUTES.ADD_PRODUCT,
  //   {
  //     id: uuid
  //   }
  // )
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
