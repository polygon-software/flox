<template>
  <q-page class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md"
      style="width: 800px"
    >
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


// ----- Data -----
const columns = [
  { name: 'date', label: i18n.global.t('employee_dashboard.date'), field: 'date', sortable: true },
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'customer', sortable: true },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'institute', sortable: true },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true },
  { name: 'mortage_amount', label: i18n.global.t('employee_dashboard.mortage_amount'), field: 'mortage_amount', sortable: true },
  { name: 'status', label: i18n.global.t('employee_dashboard.status'), field: 'status', sortable: false, style: 'padding: 30px; color: white; background-color: #58ACFA; -webkit-background-clip: content-box; background-clip: content-box;' },
  { name: 'offers', label: i18n.global.t('employee_dashboard.offers'), field: 'offers', sortable: false },
]

const rows = [
  { name: 'bsp1', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Luzern', mortage_amount: '620000.00', status: 'Offen', offers: ''},
  { name: 'bsp2', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Zürich', mortage_amount: '1620000.00', status: 'In Bearbeitung', offers: ''},
  { name: 'bsp3', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmen', mortage_amount: '620000.00', status: 'Offerte abgelehnt', offers: ''},
  { name: 'bsp4', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Kriens', mortage_amount: '620000.00', status: 'Eingereicht', offers: ''},
  { name: 'bsp5', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Offeriert', offers: ''},
  { name: 'bsp6', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Auftragsblatt hochgeladen', offers: ''},
  { name: 'bsp7', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Kreditvertrag in Bearbeitung', offers: ''},
  { name: 'bsp8', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Kreditvertrag versendet', offers: ''},
  { name: 'bsp9', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Kreditvertrag unterzeichnet zurück', offers: ''},
  { name: 'bsp10', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Produktvereinbarung bestätigt', offers: ''},
  { name: 'bsp11', date: '22.11.2021', customer: 'Jusuf Amzai', institute: 'ZKB', location: 'Emmenbrücke', mortage_amount: '620000.00', status: 'Abgeschlossen', offers: ''},
]

// TODO: after Sprint 3 remove the computedResult data with the corresponding data from database
// const queryResult = subscribeToQuery(MY_CUSTOMERS) as Ref<Record<string, Array<Record<string, unknown>>>>

/*const rows = computed(()=>{
  return queryResult.value ?? []
})*/

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
