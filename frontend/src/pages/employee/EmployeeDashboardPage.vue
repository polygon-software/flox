<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md q-ma-md"
      style="max-width: 1200px"
    >
      <!-- Own info -->
      <CompanyEmployeeId/>

      <!-- Title + search + button row -->
      <div
        class="row justify-between q-ma-none"
        style="height: 40px"
      >
        <h6 class="q-ma-none">
          {{ $t('employee_dashboard.applications') }}
          <!--          {{ $t('employee_dashboard.applications') }} ({{ rows.length }})-->
        </h6>
        <div class="row q-ma-none q-pa-none">
          <q-input
            v-model="search"
            :label="$t('general.search')"
            type="search"
            outlined
            dense
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            :label="$t('employee_dashboard.new_assignment')"
            color="primary"
            icon="add"
            dense
            unelevated
            padding="8px"
            style="height: 40px; border-radius: 8px; margin-left: 12px"
            @click="newAssignment"
          />
        </div>
      </div>
      <div class="q-ma-md col text-center">
        <!-- Dossier Overview -->
        <EmployeeDashboardTable
          :search="search"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import EmployeeDashboardTable from 'components/tables/EmployeeDashboardTable.vue';
import CompanyEmployeeId from 'components/cards/CompanyEmployeeIdCard.vue';
import {CREATE_DOSSIER, CREATE_OFFER} from 'src/data/mutations/DOSSIER';
import {executeMutation} from 'src/helpers/data-helpers';
import {OFFER_STATUS} from 'src/data/ENUM/ENUM';

const search = ref('')

// const $routerService: RouterService = inject('$routerService') as RouterService Todo Re-enable once create dossier form is added

/**
 * Routes to the new assignment page to add more dossiers
 * @returns {Promise<void>} - done
 */
async function newAssignment(): Promise<void> {
  // await $routerService.routeTo(ROUTES.NEW_ASSIGNMENT_PAGE) Todo Re-enable once create dossier form is added
  // correspondence Address
  const correspondenceAddress = {
    street: 'Irrelevant Street',
    number: '6',
    city: 'Unimportant City',
    zip_code: '8620'
  }

  //original Bank
  const options = [
    {abbreviation: 'ZKB', name: 'Züricher Kantonal Bank'},
    {abbreviation: 'UBS', name: 'UBS Schweiz'},
    {abbreviation: 'LNT', name: 'Bank Lindt'},
    {abbreviation: 'PST', name: 'Postfinance'}
  ]
  const bank = options[Math.floor(Math.random() * options.length)]

  //born
  const born = new Date(2021 - Math.floor(Math.random()*100), Math.floor(Math.random()*24) , Math.floor(Math.random()*28))
  const cities = ['Zürich', 'Basel', 'Genf', 'Bern', 'Winterthur', 'Zug', 'Sion']
  //Property Address
  const propertyAddress = {
    street: 'Unknown Street',
    number: '7',
    city: cities[Math.floor(Math.random()*cities.length)]
    ,
    zip_code: '8720'
  }

  //loan
  const loanSum = Math.random() * 100000
  // Person
  const firstNames = ['Tobias', 'Tim', 'Fritz', 'Robin', 'Bob', 'Samuel', 'Ester']
  const lastNames = ['Züricher', 'Mühler', 'Goldstein', 'Bauer', 'Schweizer', 'Kündig', 'Rothorn']
  const firstName = firstNames[Math.floor(Math.random()*firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random()*lastNames.length)]
  const email = 'email@email.email'

  const res = await executeMutation(CREATE_DOSSIER, {
    first_name: firstName,
    last_name: lastName,
    correspondence_address: correspondenceAddress,
    original_bank_name: bank.name,
    original_bank_abbreviation: bank.abbreviation,
    born,
    property_address: propertyAddress,
    loan_sum: loanSum,
    email
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const dossierUuid = res?.data?.[CREATE_DOSSIER.cacheLocation].uuid as string

  const nrOfBanks = Math.floor(Math.random()*4)
  const bankUuids = [
    '0cd9ad22-f414-45a9-8594-152c04f6a560',
    '89fe6300-b0c4-4c85-aa31-310a33e24ff9',
    '5652fe9f-845d-48de-bb93-53fecb6c2076',
    '6d67b018-6e4f-44ec-8d65-425e7b62412c',
  ]
  const chosen: Array<string> = []
  while (chosen.length < nrOfBanks){
    const status = Object.keys(OFFER_STATUS)[Math.floor(Math.random() * Object.keys(OFFER_STATUS).length)]
    const next = bankUuids[Math.floor(Math.random()*bankUuids.length)]
    if(!(chosen.includes(next))){
      chosen.push(next)
      await executeMutation(CREATE_OFFER, {
        bank_uuid: next,
        dossier_uuid: dossierUuid,
        status: status
      })
    }
  }
}
</script>
