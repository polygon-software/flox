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
            v-model="search_employee"
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
        <DashboardsTable
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
import DashboardsTable from 'components/tables/DashboardsTable.vue';
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
  { name: 'bsp1', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Luzern', mortage_amount: '620000.00', status: 'Offen', uploads: '', offers: ['CS', 'UB', 'KZ']},
  { name: 'bsp2', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Zürich', mortage_amount: '1620000.00', status: 'In Bearbeitung', uploads: '', offers: ['CS']},
  { name: 'bsp3', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmen', mortage_amount: '620000.00', status: 'Offerte abgelehnt', uploads: '', offers: []},
  { name: 'bsp4', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Kriens', mortage_amount: '620000.00', status: 'Eingereicht', uploads: '', offers: ['UB']},
  { name: 'bsp5', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Offeriert', uploads: '', offers: ['KZ']},
  { name: 'bsp6', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Auftragsblatt hochgeladen', uploads: '', offers: ['UB', 'KZ']},
  { name: 'bsp7', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Kreditvertrag in Bearbeitung', uploads: '', offers: ['CS', 'KZ']},
  { name: 'bsp8', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Kreditvertrag versendet', uploads: '', offers: ['KZ']},
  { name: 'bsp9', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Kreditvertrag unterzeichnet zurück', uploads: '', offers: []},
  { name: 'bsp10', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Produktvereinbarung bestätigt', uploads: '', offers: []},
  { name: 'bsp11', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Abgeschlossen', uploads: '', offers: ['UB']},
  { name: 'bsp12', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Nicht vermittelbar', uploads: '', offers: ['CS']},
]

// TODO: after Sprint 3 remove the computedResult data with the corresponding data from database
// const queryResult = subscribeToQuery(MY_CUSTOMERS) as Ref<Record<string, Array<Record<string, unknown>>>>

/*const rows = computed(()=>{
  return queryResult.value ?? []
})*/

function showOptions(){
  // TODO: remove creditor and employee, and check from backend if the logged user is a creditor or an emloyee
  const creditor = false
  const employee = true
  if (creditor){
    return [
      'Nicht vermittelbar', 'Offen', 'In Bearbeitung', 'Eingereicht', 'Offeriert', 'Offerte abgelehnt', 'Auftragsblatt hochgeladen', 'Kreditvertrag in Bearbeitung', 'Kreditvertrag versendet', 'Kreditvertrag unterzeichnet zurück', 'Produktvereinbarung bestätigt', 'Abgeschlossen',
    ]
  }
  else if (employee) {
    return [
      'Nicht vermittelbar', 'Offen', 'In Bearbeitung', 'Eingereicht', 'Auftragsblatt hochgeladen', 'Produktvereinbarung bestätigt', 'Abgeschlossen',
    ]
  }
}

const emit = defineEmits(['change'])

const search_employee = ref('')

function searchEmployee(){
  emit('change', {
    search_employee: search_employee.value,
  })
}


const $routerService: RouterService = inject('$routerService')

async function newAssignment(): Promise<void> {
  // TODO: to create a new assignment
  await $routerService.routeTo(ROUTES.NEW_ASSIGNMENT_PAGE)
}
</script>
