<template>
  <q-page
    class="q-pa-lg q-ma-lg">

    <!-- Container for search & adding -->
    <div class="row justify-between q-ma-none q-pb-lg">
      <h5 class="q-ma-none">
        {{ $t('dashboards.offer') + ' (' + mockedOffers.length + ')' }}
      </h5>
    </div>

    <!-- Offers Overview -->
    <div class="column" style="margin-bottom: 32px">
      <q-table
        card-style="border-radius: 8px; background-color: transparent"
        table-header-class="bg-transparent"
        :rows="mockedOffers"
        :columns="columns"
        row-key="uuid"
        :rows-per-page-options="[10,20, 100]"
        separator="none"
        :filter="search"
        flat
      >
        <template #body="props">
          <q-tr
            :props="props"
            style="background-color: white; cursor: pointer"
            @click="() => onRowClick(props.row)"
          >
            <q-td key="date" :props="props">
              {{ getDate(props.row.date) }}
            </q-td>
            <q-td key="offer_id" :props="props">
              {{ props.row.offer_id }}
            </q-td>
            <q-td key="city" :props="props">
              {{ props.row.city }}
            </q-td>
            <q-td key="market_value" :props="props">
              {{ props.row.market_value }}
            </q-td>
            <q-td key="mortgage" :props="props">
              {{ props.row.mortgage }}
            </q-td>
            <q-td key="b_degree" :props="props">
              {{ props.row.b_degree.toString() }}%
            </q-td>
            <q-td key="acceptability_of_risks" :props="props">
              {{ props.row.acceptability_of_risks.toString() }}%
            </q-td>
            <q-td key="expiration" :props="props">
              {{ getDate(props.row.expiration) }}
            </q-td>
            <q-td key="download" :props="props">
              <q-icon name="download" size="md" @click="downloadDocs"/>
            </q-td>
            <q-td key="offer_status" :props="props">
              <q-btn-dropdown rounded color="primary" :label="props.row.offer_status" no-caps>
                <q-list v-for="label in possibleStatus" :key="label">
                  <q-item v-close-popup clickable @click="statusChange">
                    <q-item-section>
                      <q-item-label>{{ label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
            <q-td key="status" :props="props">
              <q-icon name="circle" :color="props.row.status? 'green' : 'red'" size="md"/>
            </q-td>
          </q-tr>
          <!-- One spacer row per row -->
          <q-tr style="height: 14px"/>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {DOSSIERS_BANK} from 'src/data/queries/QUERIES';

//ToDo: connect to backend
const dossiers = subscribeToQuery(DOSSIERS_BANK, {})

const mockedOffers = [{
  date: new Date(1639489283 * 1000),
  offer_id: 1234,
  city: 'Luzern',
  market_value: 12341234.00,
  mortgage: 109333.00,
  b_degree: 32,
  acceptability_of_risks: 66,
  expiration: new Date(1639489283 * 1000),
  download: 'file',
  offer_status: 'offeriert',
  status: true
},
  {
    date: new Date(1639489283 * 1000),
    offer_id: 5677,
    city: 'Zürich',
    market_value: 1234.00,
    mortgage: 133.00,
    b_degree: 11,
    acceptability_of_risks: 12,
    expiration: new Date(1639489283 * 1000),
    download: 'file',
    offer_status: 'abgelehnt',
    status: false
  }]

/**
 * Function to download all the files corresponding to the certain offer
 * @returns {void}
 */
async function downloadDocs() {
  //ToDo: Create a download docs function
}

/**
 * Changes the status of the offer
 * @returns {void}
 */
async function statusChange() {
  //ToDo: create function to change the status
}

/**
 * Return date in a nice way // TODO replace once helper file is merged
 * @param {Date} date - date to format
 * @returns {String} date
 */
function getDate(date: Date ) {
  return `${date.getUTCDate()}.${date.getUTCMonth()}.${date.getUTCFullYear()}`;
}

const columns = [
  {name: 'date', label: i18n.global.t('account_data.date'), field: 'date', sortable: true},
  {name: 'offer_id', label: i18n.global.t('dashboards.offer_id'), field: 'offer_id', sortable: true},
  {name: 'city', label: i18n.global.t('account_data.city'), field: 'city', sortable: false},
  {name: 'market_value', label: i18n.global.t('dashboards.market_value'), field: 'market_value', sortable: true},
  {name: 'mortgage', label: i18n.global.t('dashboards.mortgage'), field: 'mortgage', sortable: true},
  {name: 'b_degree', label: i18n.global.t('dashboards.b_degree'), field: 'b_degree', sortable: true},
  {
    name: 'acceptability_of_risks',
    label: i18n.global.t('dashboards.acceptability_of_risks'),
    field: 'acceptability_of_risks',
    sortable: true
  },
  {name: 'expiration', label: i18n.global.t('dashboards.expiration'), field: 'expiration', sortable: true},
  {name: 'download', label: ' ', field: 'download', sortable: true},
  {name: 'offer_status', label: ' ', field: 'offer_status', sortable: true},
  {name: 'status', label: i18n.global.t('account_data.status'), field: 'status', sortable: true},
]

const possibleStatus = [i18n.global.t('status.offered'),
  i18n.global.t('status.offer_rejected'),
  i18n.global.t('status.offer_withdrawn'),
  i18n.global.t('status.in_progress'),
  i18n.global.t('status.sent'),
  i18n.global.t('status.signed'),
  i18n.global.t('status.completed'),
]

</script>
