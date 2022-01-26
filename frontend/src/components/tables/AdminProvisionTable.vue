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
            <q-td key="volume" :props="props">
              <!-- TODO volume -->
              600'000
            </q-td>
            <q-td key="prov_soi" :props="props">
              <!-- TODO volume -->
              40'000
            </q-td>
            <q-td key="prov_org" :props="props">
              <!-- TODO volume -->
              60'000
            </q-td>
        </q-tr>

        <!-- One spacer row per row -->
        <q-tr
          style="height: 14px"
        />

        <!-- Last entry: sum row -->
        <q-tr v-if="props.rowIndex === rows.length-1">
          <q-td key="company_name"/>
          <q-td key="volume" :props="props">
            <!-- TODO sum -->
            <strong>
              1'200'000
            </strong>
          </q-td>
          <q-td key="prov_soi" :props="props">
            <!-- TODO sum -->
            <strong>
              80'000
            </strong>
          </q-td>
          <q-td key="prov_org" :props="props">
            <!-- TODO sum -->
            <strong>
              120'000
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

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const searchTerm = ref('')
const fromDate: Ref<string|null> = ref(null)
const toDate: Ref<string|null> = ref(null)

// ----- Data -----
const columns = [
  { name: 'company_name', label: i18n.global.t('account_data.broker'), field: 'company_name', sortable: true, align: 'center' },
  { name: 'volume', label: i18n.global.t('account_data.mortgage_volume'), field: 'volume', sortable: true, align: 'center' },
  { name: 'prov_soi', label: i18n.global.t('account_data.provision_soi'), field: 'prov_soi', sortable: true, align: 'center' },
  { name: 'prov_org', label: i18n.global.t('account_data.provision_company'), field: 'prov_org', sortable: false, align: 'center' },
]

const queryResult = subscribeToQuery(ALL_COMPANIES_PROVISIONS) as Ref<Record<string, Array<Record<string, unknown>>>>

// Filters dossiers within the returned data by date
const rows = computed(()=> {
  const companies = queryResult.value

  // TODO filter
  // // Filter by 'from'/'to' date if filter is set
  // if(fromDate.value || toDate.value){
  //   const correctedEmployees: Record<string, unknown>[] = []
  //
  //   employees.forEach((employee: Record<string, unknown>) => {
  //     const filteredDossiers = (employee.dossiers as Record<string, unknown>[]).filter((dossier: Record<string, unknown>) => {
  //       const validFrom = fromDate.value ? new Date(dossier.created_at).getTime() > new Date(fromDate.value).getTime() : true
  //       const validTo = toDate.value ? new Date(dossier.created_at).getTime() < new Date(toDate.value).getTime() : true
  //       return validFrom && validTo
  //     })
  //
  //     // Add to employees array
  //     correctedEmployees.push({
  //       ...employee,
  //       dossiers: filteredDossiers
  //     })
  //   })
  //   return correctedEmployees
  // }

  // If no filters set, return directly
  return companies ?? []
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
