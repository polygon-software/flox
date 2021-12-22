<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      v-model:selected="selected"
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      :rows="rows"
      :columns="columns"
      :filter="props.search"
      :filter-method="filter"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      flat
    >
    <template #body="props">
      <q-tr
        :props="props"
        style="background-color: white; cursor: pointer"
      >
        <q-td key="date">
          {{ dateString(props.row.created_at) }}
        </q-td>
        <q-td key="customer">
          {{ props.row.first_name + " " + props.row.last_name }}
        </q-td>
        <q-td key="institute">
          {{ props.row.original_bank.name }}
        </q-td>
        <q-td key="location">
          {{ props.row.property_address.city }}
        </q-td>
        <q-td key="mortgage_amount">
          {{ props.row.loan_sum }}
        </q-td>
        <q-td key="status">
          <q-chip :style="dossierChipStyle(props.row.status)">
            {{ $t('dossier_status_enum.' + props.row.status) }}
          </q-chip>
          <q-popup-edit
            v-slot="scope"
            :auto-save="true"
            :model-value="props.row.status"
            @save="(value) => onUpdateStatus(value, props.row.uuid)"
          >
            <q-select
              v-model="scope.value"
              :option-label="(status)=>$t('dossier_status_enum.' + status)"
              :options="Object.keys (DOSSIER_STATUS)"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="uploads">
          {{ props.row.uploads }}
          <q-btn
            :label="$t('employee_dashboard.all_documents')"
            @click="showAllDocuments"
          />
        </q-td>
        <q-td key="offers" @click="()=>expandOffers(props.row.uuid)">
          <q-chip
            v-for="(offer, index) in props.row.offers"
            :key="index"
            :style="offerChipStyle(offer.status)"
          >
            {{ offer.bank.abbreviation }}
          </q-chip>
        </q-td>
        <q-td key="non-arrangeable">
          <q-icon v-if="props.row.non_arrangeable" name="warning" size="30px" color="red"/>
        </q-td>
      </q-tr>
      <div v-if="expanded[props.row.uuid]"
      >
        <q-tr v-for="offer in props.row.offers"
              :key="offer.uuid"
              :props="props"
              style="background-color: white; cursor: pointer"
        >
          <q-td key="date"> --></q-td>
          <q-td>{{offer.bank.name}}</q-td>
          <q-td>
            <q-chip
              :style="offerChipStyle(offer.status)"
            >
              {{ $t('offer_status_enum.' + offer.status) }}
            </q-chip>
          </q-td>
        </q-tr>
      </div>

      <!-- one spacer row per row -->
      <q-tr style="height: 14px"/>
    </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import UploadDocumentsDialog from 'src/components/dialogs/UploadDocumentsDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {SET_DOSSIER_STATUS} from 'src/data/mutations/DOSSIER';
import {i18n} from 'boot/i18n';
import {OFFER_STATUS, DOSSIER_STATUS} from 'src/data/ENUM/ENUM';
import {MY_DOSSIERS} from 'src/data/queries/QUERIES';
import {showNotification} from 'src/helpers/notification-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {recursiveFilter} from 'src/helpers/filter-helpers';

const $q: QVueGlobals = useQuasar()

// Selection must be an array
const selected = ref([])

const props = defineProps({
    search: {
      type: String,
      default: ''
    }
  }
)


// ----- Data -----
const columns = [
  { name: 'date', label: i18n.global.t('employee_dashboard.date'), field: 'date', sortable: true },
  // customer + customer id
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'first_name', sortable: true },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'original_bank.name', sortable: true },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true },
  { name: 'mortgage_amount', label: i18n.global.t('employee_dashboard.mortgage_amount'), field: 'mortgage_amount', sortable: true },
  { name: 'status', label: i18n.global.t('employee_dashboard.status'), field: 'status', sortable: false },
  { name: 'uploads', label: i18n.global.t('employee_dashboard.uploads'), field: 'uploads', sortable: false },
  { name: 'offers', label: i18n.global.t('employee_dashboard.offers'), field: 'offers', sortable: false },
  { name: 'non-arrangeable', label:'', field: '\'non-arrangeable\'', sortable: true },
]


const dossiers = subscribeToQuery(MY_DOSSIERS) as Ref<Record<string, Array<Record<string, unknown>>>>
const rows = computed( () => {
  return dossiers.value ?? []
})

const expanded: Ref<Record<string, boolean>> = ref({})

/**
 * Search Filter
 * @param {Record<string, unknown>[]} rows - rows
 * @param {string} terms - search key
 * @returns {Record<string, unknown>[]} - filtered rows
 */
function filter(rows:Record<string, unknown>[], terms:string){
  return rows.filter((row)=>recursiveFilter(row, terms))
}

/**
 * Edits the dossier status and update the status with the selected item
 * @param {string} status - the status of the dossier
 * @param {string} uuid - the uuid
 * @returns {void}
 */
function onUpdateStatus(status: DOSSIER_STATUS, uuid:string){
  executeMutation(
    SET_DOSSIER_STATUS,
    {
      uuid: uuid,
      status: status,
    }
  ).then(()=>{
    showNotification(
      $q,
      i18n.global.t('messages.success'),
      undefined,
      'positive'
    )
  }).catch(()=>{
    showNotification(
      $q,
      i18n.global.t('messages.failure'),
      undefined,
      'negative'
    )
  })
}
/**
 * ToDo Fix colors
 * Chip color depending on the status
 * @param  {DOSSIER_STATUS} status - status of Dossier
 * @returns {string} - style
 */
function offerChipStyle(status: OFFER_STATUS){
  const color = 'color: white; background-color: '
  switch (status) {
    case OFFER_STATUS.INTERESTED:
      return color + '#f0b000;'
    case OFFER_STATUS.IN_PROCESS:
      return color + '#040f85;'
    case OFFER_STATUS.RETRACTED:
      return color + '#c92002;'
    case OFFER_STATUS.ACCEPTED:
      return color + '#16630a;'
  }
  return color + '#000000;'
}

/**
 * ToDo Fix colors
 * Chip color depending on the status
 * @param  {DOSSIER_STATUS} status - status of Dossier
 * @returns {string} - style
 */
function dossierChipStyle(status: DOSSIER_STATUS){
  const color = 'color: white; background-color: '
  switch (status) {
    case DOSSIER_STATUS.OPEN:
      return color + '#58ACFA;'
    case DOSSIER_STATUS.SIGNED:
      return color + '#52130A;'
    case DOSSIER_STATUS.REJECTED:
      return color + '#A82CF0;'
    case DOSSIER_STATUS.SUBMITTED:
      return color + '#4126F9;'
    case DOSSIER_STATUS.OFFERED:
      return color + '#378F23;'
    case DOSSIER_STATUS.COMPLETED:
      return color + '#1FB06C;'
    case  DOSSIER_STATUS.IN_PROGRESS:
      return color + '#A22736;'
    case DOSSIER_STATUS.SENT:
      return color + '#F829F3;'
  }
  return color + '#000000;'
}

/**
 * Opens the dialog to show all documents and to upload further documents
 * @returns {void}
 */
function showAllDocuments() {
  $q.dialog({
    title: 'UploadDocumentsDialog',
    component: UploadDocumentsDialog,
  })
}

/**
 * Date to string function
 * @param {Date} date - date
 * @returns {string} - date string
 */
function dateString(date:string){
  const realDate = new Date(Date.parse(date))
  return formatDate(realDate)
}

/**
 * Expand row
 * @param {string} uuid - uuid of dossier to expand offers on
 * @returns {void}
 */
function expandOffers(uuid:string): void{
  expanded.value[uuid]= !expanded.value[uuid]
}


</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: -10px; /* correct offset on first border spacing if desired */
}
td {
  padding: 10px;
}
td:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
td:last-child {
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
