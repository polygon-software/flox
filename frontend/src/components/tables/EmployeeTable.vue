<template>
  <div class="column" style="margin-bottom: 32px">
    <div
      class="row justify-between q-ma-none"
    >
      <h6 class="q-ma-none">
        {{ $t('account_data.employees') + ' (' + computedResult.length + ')' }}
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
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Register new employee -->
        <q-btn
          icon="add"
          :label="$t('authentication.employee_signup')"
          dense
          color="primary"
          style="height: 40px"
          @click="routeToRegisterEmployee"
        />
      </div>
    </div>
    <q-table
      color="transparent"
      table-header-class="bg-transparent"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      flat
    >

    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, ref, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {MY_EMPLOYEES} from 'src/data/queries/QUERIES';
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
const $routerService: RouterService|undefined = inject('$routerService')

// Search term
const search = ref('')

// ----- Data -----
const columns = [
  { name: 'first_name', label: i18n.global.t('account_data.first_name'), field: 'first_name', sortable: true },
  { name: 'last_name', label: i18n.global.t('account_data.last_name'), field: 'last_name', sortable: true },
  { name: 'function', label: i18n.global.t('account_data.company_function'), field: 'function', sortable: true },
  { name: 'phone', label: i18n.global.t('account_data.phone_number'), field: 'phone', sortable: false },
  { name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: false },
]

const queryResult = subscribeToQuery(MY_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

/**
 * Routes to the page for registering a new employee
 */
async function routeToRegisterEmployee(): Promise<void> {
  await $routerService?.routeTo(ROUTES.NEW_EMPLOYEE_PAGE)
}

</script>
