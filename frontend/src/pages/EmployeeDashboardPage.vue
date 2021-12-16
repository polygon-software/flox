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
      <div class="q-ma-md col text-center" style="display: flex; justify-content: space-between; align-items: baseline">
        {{ $t('employee_dashboard.applications') }}
<!--          {{ $t('employee_dashboard.applications') }} ({{ rows.length }})-->
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
      </div>
      <div class="q-ma-md col text-center">
        <!-- Dossier Overview -->
        <EmployeeDashboardTable
          :options="showOptions()"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import EmployeeDashboardTable from 'components/tables/EmployeeDashboardTable.vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import CompanyEmployeeId from 'components/cards/CompanyEmployeeId.vue';


/**
 * Shows an array of options to be selected depending if creditor or employee
 * @returns {string[]} - returns a string as array with all options
 */
function showOptions(){
  // TODO: remove creditor and employee, and check from backend if the logged user is a creditor or an emloyee
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
 * Searches employee and emits the event change to show the customers searched in the input search
 * @returns {void}
 */
function searchEmployee(){
  emit('change', {
    searchEmployees: searchEmployees.value,
  })
}


const $routerService: RouterService = inject('$routerService')

/**
 * Routes to the new assignment page to add more customers
 * @async
 * @returns {void}
 */
async function newAssignment(): Promise<void> {
  await $routerService.routeTo(ROUTES.NEW_ASSIGNMENT_PAGE)
}
</script>
