<template>
  <div
    class="column full-width"
    style="max-width: 900px"
  >
    <div
      class="row justify-between q-ma-none"
    >
      <h6 class="q-ma-none">
        {{ $tc('dashboards.dossier', 2) }}
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
            <q-td key="first_name" :props="props">
              {{ props.row.first_name }}
            </q-td>
            <q-td key="last_name" :props="props">
              {{ props.row.last_name }}
            </q-td>
            <q-td key="dossiers" :props="props">
              {{ props.row.dossiers.length.toLocaleString() }}
            </q-td>
            <q-td key="volume" :props="props">
              CHF {{ dossierVolumeSum(props.row).toLocaleString()}}
            </q-td>
            <q-td key="prov_org" :props="props">
              CHF {{ (Math.round(getProvisionTotalForEmployee(props.row) * provisionsFactor)).toLocaleString() }}
            </q-td>
        </q-tr>

        <!-- One spacer row per row -->
        <q-tr
          style="height: 14px"
        />

        <!-- Last row: append sum row -->
        <q-tr v-if="props.rowIndex === rows.length-1">
          <q-td key="first_name"/>
          <q-td key="last_name"/>
          <q-td key="dossiers" :props="props">
            {{ totalCount.toLocaleString() }}
          </q-td>
          <q-td key="volume" :props="props">
            <strong>
              CHF {{ totalAmount.toLocaleString() }}
            </strong>
          </q-td>
          <q-td key="prov_org" :props="props">
            <strong>
              CHF {{ totalProvisions.toLocaleString() }}
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
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import TableFilterSearch from 'components/menu/TableFilterSearch.vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {MY_EMPLOYEES_PROVISIONS} from 'src/data/queries/EMPLOYEE';
import {useRoute} from 'vue-router';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';
import {
  filterEmployeesDossiersByDates,
  getProvisionFactor,
  getProvisionTotalForEmployee
} from 'src/helpers/provision-helpers';
const route = useRoute()

const $routerService: RouterService|undefined = inject('$routerService')

// Company ID from route (if any), only relevant if going from SOIAdmin -> Company view
const companyUuid = route.query.cid

// Search term
const searchTerm = ref('')
const fromDate: Ref<string|null> = ref(null)
const toDate: Ref<string|null> = ref(null)

// ----- Data -----
const columns = [
  { name: 'first_name', label: i18n.global.t('account_data.first_name'), field: 'first_name', sortable: true, align: 'center' },
  { name: 'last_name', label: i18n.global.t('account_data.last_name'), field: 'last_name', sortable: true, align: 'center' },
  { name: 'dossiers', label: i18n.global.tc('dashboards.dossier', 2), field: 'dossiers', sortable: true, align: 'center' },
  { name: 'volume', label: i18n.global.t('account_data.volume'), field: 'volume', sortable: true, align: 'center' },
  { name: 'prov_org', label: i18n.global.t('account_data.provision_company'), field: 'prov_org', sortable: false, align: 'center' },
]

const queryResult = subscribeToQuery(MY_EMPLOYEES_PROVISIONS as QueryObject, companyUuid? { companyUuid } : {}) as Ref<Record<string, unknown>[]>

// Filters dossiers within the returned data by date
const rows = computed(()=> {
  const employees = queryResult.value

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

    return filterEmployeesDossiersByDates(employees, fromDateAsDate, toDateAsDate)
  }

  // If no filters set, return directly
  return employees ?? []
})

// Total count of dossiers
const totalCount = computed(() => {
  let total = 0
  rows.value.forEach((employee: Record<string, unknown>) => {
    total += (employee.dossiers as Record<string, unknown>[]).length
  })
  return total;
})

// Total mortgage amount of dossiers
const totalAmount = computed(() => {
  let total = 0
  rows.value.forEach((employee: Record<string, unknown>) => {
    const dossiers = employee.dossiers as Record<string, number>[]
    dossiers.forEach((dossier) => {
      total += dossier.mortgage_amount
    })
  })
  return total;
})

// Provisions percentage
const provisionsFactor = computed(() => {
  return getProvisionFactor(totalAmount.value)
})

// Total provision amount across all employees
const totalProvisions = computed(() => {
  let total = 0
  rows.value.forEach((employee: Record<string, unknown>) => {
    total += getProvisionTotalForEmployee(employee)
  })

  // Apply company's provision factor
  return Math.round(total * provisionsFactor.value)
})


/**
 * Upon clicking a row, opens the employee's dashboard view
 * @param {Record<string, unknown>} row - the row that was clicked
 * @returns {Promise<void>} - completed
 */
async function onRowClick(row: Record<string, unknown>): Promise<void>{
  const params = companyUuid ? {
    cid: companyUuid,
    eid: row.uuid
    } : {
    eid: row.uuid
  }
  await $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD, params)
}

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
 * Calculates the sum of a given employee's dossier amounts
 * @param {Record<string, unknown>} employee - employee database entry
 * @returns {number} - total amount
 */
function dossierVolumeSum(employee: Record<string, unknown>){
  let totalVolume = 0
  const dossiers = employee.dossiers as Record<string, unknown>[] ?? []

  dossiers.forEach((dossier) => {
    totalVolume += (dossier as Record<string, number>).mortgage_amount
  })

  return totalVolume
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
