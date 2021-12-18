<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      v-model:selected="selected"
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      :rows="rows"
      :columns="columns"
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
          {{ props.row.date }}
        </q-td>
        <q-td key="customer">
          {{ props.row.customer }}
        </q-td>
        <q-td key="institute">
          {{ props.row.institute }}
        </q-td>
        <q-td key="location">
          {{ props.row.location }}
        </q-td>
        <q-td key="mortgage_amount">
          {{ props.row.mortgage_amount }}
        </q-td>
        <q-td key="status">
          <q-chip :style="chipStyle(props.row.status)">
            {{ $t('employee_dashboard.' +props.row.status) }}
          </q-chip>
          <q-popup-edit
            v-slot="scope"
            :auto-save="true"
            :model-value="props.row.status"
            @save="(value) => onUpdateStatus(props.row.status, {name: value})"
          >
            <q-select
              v-model="scope.value"
              :options="props.options"
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
        <q-td key="offers">
          <q-chip
            v-for="(offer, index) in props.row.offers.slice(0,3)"
            :key="index"
          >
            {{ offer }}
          </q-chip>
        </q-td>
      </q-tr>
      <!-- One spacer row per row -->
      <q-tr style="height: 14px"/>
    </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {executeMutation} from 'src/helpers/data-helpers';
import UploadDocumentsDialog from 'src/components/dialogs/UploadDocumentsDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {SET_DOSSIER_STATUS} from 'src/data/mutations/DOSSIER';
import {i18n} from 'boot/i18n';
import {STATUS} from 'src/data/ENUM/ENUM';

const $q: QVueGlobals = useQuasar()

// Selection must be an array
const selected = ref([])

defineProps({
  options: {
    required: false,
    type: Array,
    default: () => [],
  }
})

// ----- Data -----
const columns = [
  { name: 'date', label: i18n.global.t('employee_dashboard.date'), field: 'date', sortable: true },
  // customer + customer id
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'customer', sortable: true },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'institute', sortable: true },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true },
  { name: 'mortgage_amount', label: i18n.global.t('employee_dashboard.mortgage_amount'), field: 'mortgage_amount', sortable: true },
  { name: 'status', label: i18n.global.t('employee_dashboard.status'), field: 'status', sortable: false },
  { name: 'uploads', label: i18n.global.t('employee_dashboard.uploads'), field: 'uploads', sortable: false },
  { name: 'offers', label: i18n.global.t('employee_dashboard.offers'), field: 'offers', sortable: false },
]

const rows = [
  {
    name: 'bsp1',
    date: '24.11.2021',
    customer: 'Jusuf Amzai',
    institute: 'ZKB',
    location: 'Luzern',
    mortgage_amount: 620000.00,
    status: STATUS.OPEN,
    uploads: '',
    offers: ['CS', 'UB', 'KZ', 'AB']
  },
  {
    name: 'bsp2',
    date: '22.11.2021',
    customer: 'Marino',
    institute: 'ZKB',
    location: 'Zürich',
    mortgage_amount: 620000.00,
    status: STATUS.SIGNED,
    uploads: '',
    offers: ['CS']
  },
  {
    name: 'bsp3',
    date: '23.11.2021',
    customer: 'Ramize',
    institute: 'ZKB',
    location: 'Emmen',
    mortgage_amount: 620000.00,
    status: STATUS.REJECTED,
    uploads: '',
    offers: []
  },
  {
    name: 'bsp4',
    date: '25.11.2021',
    customer: 'Elexa',
    institute: 'ZKB',
    location: 'Kriens',
    mortgage_amount: 620000.00,
    status: STATUS.SUBMITTED,
    uploads: '',
    offers: ['UB']
  },
  {
    name: 'bsp5',
    date: '26.11.2021',
    customer: 'David',
    institute: 'ZKB',
    location: 'Emmenbrücke',
    mortgage_amount: 620000.00,
    status: STATUS.OFFERED,
    uploads: '',
    offers: ['KZ']
  },
  {
    name: 'bsp6',
    date: '27.11.2021',
    customer: 'Christoph',
    institute: 'ZKB',
    location: 'Luzern',
    mortgage_amount: 620000.00,
    status: STATUS.COMPLETED,
    uploads: '',
    offers: ['UB', 'KZ']
  },
  {
    name: 'bsp7',
    date: '28.11.2021',
    customer: 'Joel',
    institute: 'ZKB',
    location: 'Zürich',
    mortgage_amount: 620000.00,
    status: STATUS.IN_PROCESS,
    uploads: '',
    offers: ['CS', 'KZ']
  },
  {
    name: 'bsp8',
    date: '29.11.2021',
    customer: 'Marius',
    institute: 'ZKB',
    location: 'Zug',
    mortgage_amount: 620000.00,
    status: STATUS.SENT,
    uploads: '',
    offers: ['KZ']
  },
]

// Todo: after Sprint 3 remove the computedResult data with the corresponding data from database
// const queryResult = subscribeToQuery(MY_CUSTOMERS) as Ref<Record<string, Array<Record<string, unknown>>>>
//const rows = computed(()=>{
//return queryResult.value ?? []
//})

/**
 * Edits the dossier status and update the status with the selected item
 * @param {string} status - the status of the dossier
 * @param {string} variables - the new variables
 * @returns {void}
 */
function onUpdateStatus(status: string, variables: Record<string, unknown>){
  void executeMutation(
    SET_DOSSIER_STATUS,
    {
      //uuid: props.row.uuid,
      status: status,
      ...variables
    }
  )
}


/**
 * ToDo Fix colors
 * Chip color depending on the status
 * @param {STATUS} status - status of Dossier
 * @returns {string} - style
 */
function chipStyle(status: STATUS){
  const color = 'color: white; background-color: '
  switch (status) {
    case STATUS.OPEN:
      return color + '#58ACFA;'
    case STATUS.SIGNED:
      return color + '#52130A;'
    case STATUS.REJECTED:
      return color + '#A82CF0;'
    case STATUS.SUBMITTED:
      return color + '#4126F9;'
    case STATUS.OFFERED:
      return color + '#378F23;'
    case STATUS.COMPLETED:
      return color + '#1FB06C;'
    case STATUS.IN_PROCESS:
      return color + '#A22736;'
    case STATUS.SENT:
      return color + '#F829F3;'
  }
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
