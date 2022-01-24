<template>
  <div
    class="column full-width"
    style="max-width: 900px"
  >
    <div
      class="row justify-between q-ma-none"
    >
      <h6 class="q-ma-none">
        {{ $t('dashboards.employee_tasks') + ' (' + computedResult.length + ')' }}
      </h6>

      <!-- Container for search & adding -->
      <TableFilterSearch
        @change="updateFilter"
      />
    </div>
    <q-table
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      :filter="search"
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
            <q-td key="tasks" :props="props">
              <!-- TODO contract number -->
              4
            </q-td>
            <q-td key="volume" :props="props">
              <!-- TODO volume -->
              600'000
            </q-td>
            <q-td key="prov_emp" :props="props">
              <!-- TODO volume -->
              40'000
            </q-td>
            <q-td key="prov_org" :props="props">
              <!-- TODO volume -->
              60'000
            </q-td>
            <q-td key="prov_ratio" :props="props">
              <!-- TODO volume -->
              60'000
            </q-td>
        </q-tr>

        <!-- One spacer row per row -->
        <q-tr
          style="height: 14px"
        />

        <!-- Last entry: sum row -->
        <q-tr v-if="props.rowIndex === computedResult.length-1">
          <q-td key="first_name"/>
          <q-td key="last_name"/>
          <q-td key="tasks"/>
          <q-td key="volume" :props="props">
            <!-- TODO sum -->
            <strong>
              1'200'000
            </strong>
          </q-td>
          <q-td key="prov_emp" :props="props">
            <!-- TODO sum -->
            <strong>
              80'000
            </strong>          </q-td>
          <q-td key="prov_org" :props="props">
            <!-- TODO sum -->
            <strong>
              120'000
            </strong>          </q-td>
          <q-td key="prov_ratio" :props="props">
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
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import TableFilterSearch from 'components/menu/TableFilterSearch.vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {MY_EMPLOYEES} from 'src/data/queries/EMPLOYEE';

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')
const fromDate: Ref<string|null> = ref(null)
const toDate: Ref<string|null> = ref(null)

// ----- Data -----
const columns = [
  { name: 'first_name', label: i18n.global.t('account_data.first_name'), field: 'first_name', sortable: true, align: 'center' },
  { name: 'last_name', label: i18n.global.t('account_data.last_name'), field: 'last_name', sortable: true, align: 'center' },
  { name: 'tasks', label: i18n.global.t('account_data.tasks'), field: 'tasks', sortable: true, align: 'center' },
  { name: 'volume', label: i18n.global.t('account_data.volume'), field: 'volume', sortable: true, align: 'center' },
  { name: 'prov_emp', label: i18n.global.t('account_data.provision_employee'), field: 'prov_emp', sortable: true, align: 'center' },
  { name: 'prov_org', label: i18n.global.t('account_data.provision_company'), field: 'prov_org', sortable: false, align: 'center' },
  { name: 'prov_ratio', label: i18n.global.t('account_data.provision_ratio'), field: 'prov_ratio', sortable: false, align: 'center' },
]

const queryResult = subscribeToQuery(MY_EMPLOYEES,) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

/**
 * Upon clicking a row, opens the employee's dashboard view
 * @param {Record<string, unknown>} row - the row that was clicked
 * @returns {Promise<void>} - completed
 */
async function onRowClick(row: Record<string, unknown>): Promise<void>{
  await $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD, {
    eid: row.uuid
  })
}

/**
 * Updates the filter parameters
 * @param {Record<string, unknown>} input - Input, containing search and from/to dates
 * @returns {void}
 */
function updateFilter(input: Record<string, string>){
  search.value = input.search
  fromDate.value = input.fromDate
  toDate.value = input.toDate
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
