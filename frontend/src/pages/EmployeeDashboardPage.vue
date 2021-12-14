<template>
  <q-page class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md"
      style="width: 1200px"
    >
      <!-- Own info -->
      <CompanyEmployeeId/>
        <p
          class="q-ma-md col text-center"
          style="font-size: x-large"
        >
          {{ $t('employee_dashboard.title') }}
        </p>
        <p class="q-ma-md col text-center" style="display: flex; justify-content: space-between; align-items: baseline">
          {{ $t('employee_dashboard.title2') }} ({{ rows.length }})
          <q-input
            v-model="searchEmployees"
            color="purple-12"
            :label="$t('employee_dashboard.search')"
            type="text"
            @change="searchEmployee"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            class="q-ma-md"
            :label="$t('employee_dashboard.new_assignment')"
            color="primary"
            icon="add"
            @click="newAssignment"
          />
        </p>
      <p class="q-ma-md col text-center">
        <!-- Customer Overview -->
        <EmployeeDashboardTable
          :columns="columns"
          :rows="rows"
          :options="showOptions()"
        />
      </p>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import {i18n} from 'boot/i18n';
import EmployeeDashboardTable from 'components/tables/EmployeeDashboardTable.vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import CompanyEmployeeId from "components/cards/CompanyEmployeeId.vue";


// ----- Data -----
const columns = [
  { name: 'date', label: i18n.global.t('employee_dashboard.date'), field: 'date', sortable: true },
  // customer + customer id
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'customer', sortable: true },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'institute', sortable: true },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true },
  { name: 'mortage_amount', label: i18n.global.t('employee_dashboard.mortage_amount'), field: 'mortage_amount', sortable: true },
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
    mortage_amount: '620000.00',
    status: 'Offen',
    uploads: '',
    offers: ['CS', 'UB', 'KZ', 'AB']
  },
  {
    name: 'bsp2',
    date: '22.11.2021',
    customer: 'Marino',
    institute: 'ZKB',
    location: 'Zürich',
    mortage_amount: '1620000.00',
    status: 'Kreditvertrag unterzeichnet zurück',
    uploads: '',
    offers: ['CS']
  },
  {
    name: 'bsp3',
    date: '23.11.2021',
    customer: 'Ramize',
    institute: 'ZKB',
    location: 'Emmen',
    mortage_amount: '620000.00',
    status: 'Offerte abgelehnt',
    uploads: '',
    offers: []
  },
  {
    name: 'bsp4',
    date: '25.11.2021',
    customer: 'Elexa',
    institute: 'ZKB',
    location: 'Kriens',
    mortage_amount: '620000.00',
    status: 'Eingereicht',
    uploads: '',
    offers: ['UB']
  },
  {
    name: 'bsp5',
    date: '26.11.2021',
    customer: 'David',
    institute: 'ZKB',
    location: 'Emmenbrücke',
    mortage_amount: '620000.00',
    status: 'Offeriert',
    uploads: '',
    offers: ['KZ']
  },
  {
    name: 'bsp6',
    date: '27.11.2021',
    customer: 'Christoph',
    institute: 'ZKB',
    location: 'Luzern',
    mortage_amount: '620000.00',
    status: 'Abgeschlossen',
    uploads: '',
    offers: ['UB', 'KZ']
  },
  {
    name: 'bsp7',
    date: '28.11.2021',
    customer: 'Joel',
    institute: 'ZKB',
    location: 'Zürich',
    mortage_amount: '620000.00',
    status: 'Kreditvertrag in Bearbeitung',
    uploads: '',
    offers: ['CS', 'KZ']
  },
  {
    name: 'bsp8',
    date: '29.11.2021',
    customer: 'Marius',
    institute: 'ZKB',
    location: 'Zug',
    mortage_amount: '620000.00',
    status: 'Kreditvertrag versendet',
    uploads: '',
    offers: ['KZ']
  },
]

// after Sprint 3 remove the computedResult data with the corresponding data from database
// const queryResult = subscribeToQuery(MY_CUSTOMERS) as Ref<Record<string, Array<Record<string, unknown>>>>
//const rows = computed(()=>{
  //return queryResult.value ?? []
//})

/**
 * shows an array of options to be selected depending if creditor or employee
 * @returns {array} - returns array with all options
 */
function showOptions(){
  // remove creditor and employee, and check from backend if the logged user is a creditor or an emloyee
  const creditor = false
  const employee = true
  if (creditor){
    return [
      'Nicht vermittelbar', 'Offen', 'In Bearbeitung', 'Eingereicht', 'Offeriert', 'Offerte abgelehnt', 'Auftragsblatt hochgeladen',
      'Kreditvertrag in Bearbeitung', 'Kreditvertrag versendet', 'Kreditvertrag unterzeichnet zurück', 'Produktvereinbarung bestätigt', 'Abgeschlossen',
    ]
  }
  else if (employee) {
    return [
      'Nicht vermittelbar', 'Offen', 'In Bearbeitung', 'Eingereicht', 'Auftragsblatt hochgeladen', 'Produktvereinbarung bestätigt', 'Abgeschlossen',
    ]
  }
  return []
}

const emit = defineEmits(['change'])

const searchEmployees = ref('')

/**
 * searches employee and emits the event change to show the customers searched in the input search
 * @returns {void}
 */
function searchEmployee(){
  emit('change', {
    searchEmployees: searchEmployees.value,
  })
}


const $routerService: RouterService = inject('$routerService')

/**
 * routes to the new assignment page to add more customers
 * @async
 * @returns {void}
 */
async function newAssignment(): Promise<void> {
  await $routerService.routeTo(ROUTES.NEW_ASSIGNMENT_PAGE)
}
</script>
