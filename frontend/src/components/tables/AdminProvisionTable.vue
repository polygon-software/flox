<template>
  <div
    class="column full-width"
    style="max-width: 900px"
  >
    <div
      class="row justify-between q-ma-none"
    >
      <h6 class="q-ma-none">
        {{ $tc('account_data.provision', 2) + ' (' + rows.length + ')' }}
      </h6>
      <!-- Container for search & adding -->
      <TableFilterSearch
        @change="updateFilter"
      />
    </div>
    <q-table
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      :filter="searchTerm"
      :filter-method="tableFilter"
      flat
    >
      <template #body="props">
        <q-tr
          :props="props"
          style="background-color: white; cursor: pointer"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="company_name" :props="props">
            {{ props.row.company_name }}
          </q-td>
          <!-- Total mortgage amount for company -->
          <q-td key="volume" :props="props">
            CHF {{ companyMortgageAmount(props.row).toLocaleString() }}
          </q-td>
          <!-- Total Provision for company -->
          <q-td key="prov_total" :props="props">
           CHF {{ companyTotalProvision(props.row).toLocaleString() }}
          </q-td>
          <!-- Total Provision SOI for company -->
          <q-td key="prov_soi" :props="props">
            CHF {{ (companyTotalProvision(props.row) - Math.round(companyTotalProvision(props.row) * getProvisionFactor(companyMortgageAmount(props.row)))).toLocaleString() }}
          </q-td>
          <!-- Provision the company will receive -->
          <q-td key="prov_org" :props="props">
            CHF {{ Math.round(companyTotalProvision(props.row) * getProvisionFactor(companyMortgageAmount(props.row))).toLocaleString() }}
          </q-td>
          <q-td key="options" :props="props">
            <!-- Options dropdown -->
            <UserOptionsDropdown
              :user="props.row"
              :role="ROLE.COMPANY"
            />
          </q-td>
        </q-tr>

        <!-- One spacer row per row -->
        <q-tr
          style="height: 14px"
        />

        <!-- On last row, append sum row -->
        <q-tr v-if="props.rowIndex === rows.length-1">
          <q-td key="company_name"/>
          <!-- Mortgage volume total -->
          <q-td key="volume" :props="props">
            <strong>
              CHF {{ totalMortgageAmount.toLocaleString() }}
            </strong>
          </q-td>
          <!-- Provisions total -->
          <q-td key="prov_total" :props="props">
            <strong>
              CHF {{ totalProvisionAmount.toLocaleString( )}}
            </strong>
          </q-td>
          <!-- SOI provisions total -->
          <q-td key="prov_soi" :props="props">
            <strong>
              CHF {{ (totalProvisionAmount - totalCompanyProvisionAmount).toLocaleString( )}}
            </strong>
          </q-td>
          <!-- Company provisions total -->
          <q-td key="prov_org" :props="props">
            <strong>
              CHF {{ totalCompanyProvisionAmount.toLocaleString( )}}
            </strong>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, ref, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {i18n} from 'boot/i18n';
import {tableFilter} from 'src/helpers/filter-helpers';
import {ALL_COMPANIES_PROVISIONS} from 'src/data/queries/COMPANY';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import TableFilterSearch from 'components/menu/TableFilterSearch.vue';
import {
  getProvisionForDossier,
  getProvisionFactor,
  filterEmployeesDossiersByDates
} from 'src/helpers/provision-helpers';
import UserOptionsDropdown from 'components/menu/UserOptionsDropdown.vue';
import {ROLE} from 'src/data/ENUM/ENUM';

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const searchTerm = ref('')
const fromDate: Ref<string|null> = ref(null)
const toDate: Ref<string|null> = ref(null)

// ----- Data -----
const columns = [
  { name: 'company_name', label: i18n.global.t('account_data.broker'), field: 'company_name', sortable: true, align: 'center' },
  { name: 'volume', label: i18n.global.t('account_data.mortgage_volume'), field: 'volume', sortable: true, align: 'center' },
  { name: 'prov_total', label: i18n.global.t('account_data.provision_total'), field: 'prov_total', sortable: true, align: 'center' },
  { name: 'prov_soi', label: i18n.global.t('account_data.provision_soi'), field: 'prov_soi', sortable: true, align: 'center' },
  { name: 'prov_org', label: i18n.global.t('account_data.provision_company'), field: 'prov_org', sortable: false, align: 'center' },
  { name: 'options', label: ' ', field: 'options', sortable: false, align: 'center' },
]

const queryResult = subscribeToQuery(ALL_COMPANIES_PROVISIONS) as Ref<Record<string, unknown>[]>

// Filters dossiers within the returned companies' employees by date
const rows = computed(() => {
  const companies = queryResult.value

  // Filter by 'from'/'to' date if filter is set
  if(fromDate.value || toDate.value){
    // Format filters to ensure chosen end day is included
    const fromDateAsDate = fromDate.value ? new Date(fromDate.value) : undefined
    const toDateAsDate = toDate.value ? new Date(toDate.value) : undefined
    if(toDateAsDate){
      toDateAsDate.setHours(23)
      toDateAsDate.setMinutes(59)
      toDateAsDate.setSeconds(59)
    }

    const correctedCompanies: Record<string, unknown>[] = []

    // For every company, get its employees
    companies.forEach((company: Record<string, unknown>) => {
      const employees = company.employees as Record<string, unknown>[]

      // Add to employees array
      correctedCompanies.push({
        ...company,
        employees: filterEmployeesDossiersByDates(employees, fromDateAsDate, toDateAsDate)
      })
    })
    return correctedCompanies
  }

  // If no filters set, return directly
  return companies ?? []
})


// Total mortgage amount of all companies
const totalMortgageAmount = computed(() => {
  let total = 0
  rows.value.forEach((company: Record<string, unknown>) => {
    total += companyMortgageAmount(company)
  })
  return total;
})

// Total provision amount of all companies
const totalProvisionAmount = computed(() => {
  let total = 0
  rows.value.forEach((company: Record<string, unknown>) => {
    total += companyTotalProvision(company)
  })
  return total;
})

// Total payable provision amount of all companies
const totalCompanyProvisionAmount = computed(() => {
  let total = 0
  rows.value.forEach((company: Record<string, unknown>) => {
    total += companyTotalProvision(company) * getProvisionFactor(companyMortgageAmount(company))
  })
  return Math.round(total);
})

/**
 * Updates the filter parameters
 * @param {Record<string, unknown>} input - Input, containing search and from/to dates
 * @returns {void}
 */
function updateFilter(input: Record<string, string>){
  searchTerm.value = input.search
  fromDate.value = input.fromDate
  toDate.value = input.toDate
}


/**
 * Upon clicking a row, opens the company's dashboard view
 * @param {Record<string, unknown>} row - the row that was clicked
 * @returns {Promise<void>} - done
 */
async function onRowClick(row: Record<string, unknown>): Promise<void>{
  await $routerService?.routeTo(ROUTES.MANAGEMENT_EMPLOYEE_DATA, {
    cid: row.uuid
  })
}

/**
 * Calculates the sum of a given company's mortgage amounts
 * @param {Record<string, unknown>} company - company's database entry
 * @returns {number} - total mortgage amount
 */
function companyMortgageAmount(company: Record<string, unknown>){
  let totalAmount = 0

  const employees = company.employees as Record<string, unknown>[] ?? []

  employees.forEach((employee: Record<string, unknown>) => {
    const dossiers = employee.dossiers as Record<string, unknown>[] ?? []

    dossiers.forEach((dossier) => {
      totalAmount += (dossier as Record<string, number>).mortgage_amount
    })
  })

  return totalAmount
}

/**
 * Calculates the sum of a given company's provisions, NOT adjusted for the company's provision factor
 * @param {Record<string, unknown>} company - company's database entry
 * @returns {number} - total company provisions
 */
function companyTotalProvision(company: Record<string, unknown>){
  let totalAmount = 0

  const employees = company.employees as Record<string, unknown>[] ?? []

  employees.forEach((employee: Record<string, unknown>) => {
    const dossiers = employee.dossiers as Record<string, unknown>[] ?? []

    dossiers.forEach((dossier) => {
      totalAmount += getProvisionForDossier(dossier)
    })
  })

  return totalAmount
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
