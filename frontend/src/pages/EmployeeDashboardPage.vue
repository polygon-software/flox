<template>
  <q-page class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md"
      style="width: 1400px"
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
import {RouterService} from 'src/services/RouterService';
import CompanyEmployeeId from 'components/cards/CompanyEmployeeId.vue';
import {CREATE_DOSSIER, CREATE_OFFER} from 'src/data/mutations/DOSSIER';
import {executeMutation} from 'src/helpers/data-helpers';
import {STATUS} from 'src/data/ENUM/ENUM';


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


const $routerService: RouterService = inject('$routerService') as RouterService

/**
 * Routes to the new assignment page to add more customers
 * @returns {Promise<void>} - done
 */
async function newAssignment(): Promise<void> {
  // await $routerService.routeTo(ROUTES.NEW_ASSIGNMENT_PAGE) Todo Re-enable once create dossier form is added
  // correspondence Address
  const correspondence_address = {
    street: 'Irrelevant Street',
    number: '6',
    city: 'Unimportant City',
    zip_code: '8620'
  }

  //original Bank
  const options = [{abbreviation: 'ZKB', name: 'Züricher Kantonal Bank'}, {abbreviation: 'UBS', name: 'UBS Schweiz'},{abbreviation: 'LNT', name: 'Bank Lindt'}, {abbreviation: 'PST', name: 'Postfinance'}]
  const bank = options[Math.floor(Math.random() * options.length)]

  //born
  const born = new Date(2021 - Math.floor(Math.random()*100), Math.floor(Math.random()*24) , Math.floor(Math.random()*28))
  const cities = ['Zürich', 'Basel', 'Genf', 'Bern', 'Winterthur', 'Zug', 'Sion']
  //Property Address
  const property_address = {
    street: 'Unknown Street',
    number: '7',
    city: cities[Math.floor(Math.random()*cities.length)]
    ,
    zip_code: '8720'
  }

  //loan
  const loan_sum = Math.random() * 100000

  // Person
  const first_names = ['Tobias', 'Tim', 'Fritz', 'Robin', 'Bob', 'Samuel', 'Ester']
  const last_names = ['Züricher', 'Mühler', 'Goldstein', 'Bauer', 'Schweizer', 'Kündig', 'Rothorn']
  const first_name = first_names[Math.floor(Math.random()*first_names.length)]
  const last_name = last_names[Math.floor(Math.random()*last_names.length)]
  const email = 'email@email.email'

  const res = await executeMutation(CREATE_DOSSIER, {
    first_name,
    last_name,
    correspondence_address,
    original_bank_name: bank.name,
    original_bank_abbreviation: bank.abbreviation,
    born,
    property_address,
    loan_sum,
    email
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const dossier_uuid = res?.data[CREATE_DOSSIER.cacheLocation].uuid as string

  const nr_of_banks = Math.floor(Math.random()*4)
  const bank_uuids = ['38a0d1f8-00e9-4a42-841b-1531f649f476', '1f6d0f3b-220c-480c-bb06-270330ec4496', '46b86c1d-ad7f-402c-ada1-6242060bbed6', '91c8ee38-66ed-4477-b698-5987665038e8']
  const chosen: Array<string> = []
  while (chosen.length < nr_of_banks){
    const next = bank_uuids[Math.floor(Math.random()*bank_uuids.length)]
    if(!(chosen.includes(next))){
      chosen.push(next)
      await executeMutation(CREATE_OFFER, {
        bank_uuid: next,
        dossier_uuid,
        status: STATUS.OFFERED
      })
    }
  }
}
</script>
