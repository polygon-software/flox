<template>
  <div
    class="column full-width"
    style="max-width: 900px"
  >
    <div
      class="row justify-between q-ma-none"
    >
      <h6 class="q-ma-none">
        {{ $t('account_data.bank') + ' (' + computedResult.length + ')' }}
      </h6>

      <!-- Container for search & adding -->
      <div class="row">
        <!-- Search bar -->
        <q-input
          v-model="search"
          dense
          :label="$t('general.search')"
          outlined
          type="search"
          class="q-mb-md"
          style="margin-right: 30px"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Register new bank -->
        <q-btn
          icon="add"
          :label="$t('authentication.bank_signup')"
          dense
          color="primary"
          unelevated
          padding="8px"
          style="height: 40px; border-radius: 8px"
          @click="routeToRegisterBank"
        />
      </div>
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
      flat
    >
      <template #body="props">
        <q-tr
          :props="props"
          style="background-color: white; cursor: pointer"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="id" :props="props">
            {{ props.row.readable_id }}
          </q-td>
          <q-td key="company_name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="supervisor" :props="props">
            {{ props.row.first_name }} {{ props.row.last_name }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="date" :props="props">
            {{ formatDate(new Date(props.row.created_at)) }}
          </q-td>
        </q-tr>
        <!-- One spacer row per row -->
        <q-tr style="height: 14px"/>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, ref, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {ALL_BANKS, SOI_EMPLOYEES} from 'src/data/queries/QUERIES';
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {formatDate} from 'src/helpers/format-helpers';

const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')

// ----- Data -----
const columns = [
  { name: 'id', label: i18n.global.t('account_data.id'), field: 'id', sortable: true, align: 'center' },
  { name: 'company_name', label: i18n.global.t('account_data.company_name'), field: 'name', sortable: true, align: 'center' },
  { name: 'supervisor', label: i18n.global.t('account_data.supervisor'), field: 'supervisor', sortable: true, align: 'center' },
  { name: 'phone', label: i18n.global.t('account_data.phone_number'), field: 'phone', sortable: false, align: 'center' },
  { name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: false, align: 'center' },
  { name: 'date', label: i18n.global.t('general.date'), field: 'created_at', sortable: true, align: 'center' },
]

const queryResult = subscribeToQuery(ALL_BANKS) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

/**
 * Routes to the page for registering a new employee
 * @async
 * @returns {void}
 */
async function routeToRegisterBank(): Promise<void> {
  await $routerService?.routeTo(ROUTES.REGISTER_BANK)
}
/**
 * Upon clicking a row, opens the employee's dashboard view
 * @param {Record<string, unknown>} row - the row that was clicked
 * @async
 * @returns {void}
 */
async function onRowClick(row: Record<string, unknown>): Promise<void>{
  await $routerService?.routeTo(ROUTES.MANAGEMENT_EMPLOYEE_VIEW, {
    uuid: row.uuid
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
