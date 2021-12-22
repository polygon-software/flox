<template>
  <q-page
    class="q-pa-lg q-ma-lg">

    <!-- Container for search & adding -->
    <div class="row justify-between q-ma-none q-pb-lg">
      <h5 class="q-ma-none">
        {{ $t('dashboards.offer') + ' (' + computedResult.length + ')' }}
      </h5>
    </div>

    <!-- Offers Overview -->
    <div class="column" style="margin-bottom: 32px">
      <q-table
        card-style="border-radius: 8px; background-color: transparent"
        table-header-class="bg-transparent"
        :rows="computedResult"
        :columns="columns"
        row-key="uuid"
        :rows-per-page-options="[10,20, 100]"
        separator="none"
        :filter="search"
        :filter-method="tableFilter"
        flat
      >
        <template #body="props">
          <q-tr
            :props="props"
            style="background-color: white; cursor: pointer"
            @click="() => onRowClick(props.row)"
          >
            <q-td key="date" :props="props">
              {{ formatDate(props.row.created_at) }}
            </q-td>
            <q-td key="offer_id" :props="props">
              {{ props.row.readable_id }}
            </q-td>
            <q-td key="city" :props="props">
              {{ props.row.correspondence_address.city }}
            </q-td>
            <q-td key="market_value" :props="props">
              unknown
            </q-td>
            <q-td key="mortgage" :props="props">
              {{ props.row.loan_sum }}
            </q-td>
            <q-td key="b_degree" :props="props">
              unknown
            </q-td>
            <q-td key="acceptability_of_risks" :props="props">
              unknown
            </q-td>
            <q-td key="expiration" :props="props">
              unknown
            </q-td>
            <q-td key="download" :props="props">
              <q-icon name="download" size="md" @click="downloadDocs"/>
            </q-td>
            <q-td key="offer_status" :props="props">
              <q-popup-edit
                v-slot="scope"
                :auto-save="true"
                :model-value="props.row.status"
                @save="(value) => statusChange(value, props.row.uuid)"
              >
                <q-select
                  v-model="scope.value"
                  :option-label="(status)=>$t('dossier_status_enum.' + status)"
                  :options="Object.keys(DOSSIER_STATUS)"
                />
              </q-popup-edit>
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
import {computed} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {DOSSIER_STATUS} from 'src/data/ENUM/ENUM';

//ToDo: connect to backend
const dossiers = subscribeToQuery(DOSSIERS_BANK, {})
const computedResult = computed(()=>{
  return dossiers.value ?? []
})

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


</script>
