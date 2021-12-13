<template>
  <q-page
    class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md"
      style="width: 800px">

      <p
        class="q-ma-md col text-center"
        style="font-size: x-large"
      >
        {{ $t('dashboards.management_dashboard') }}
      </p>

      <!-- Employee Overview -->
      <DashboardsTable
        :columns="columns"
        :rows="rows"
        :title="$t('account_data.employees')"
      />

      <!-- Register new employee -->
      <div class="flex row justify-center items-center">
        <p class="col-12 text-center q-mb-xs" style="font-size: medium">{{ $t('dashboards.register_new_employee_here') }}</p>
        <q-btn
          class="col-2 q-mx-md q-mb-md q-mt-xs"
          style="width: 150px"
          :label="$t('authentication.signup')"
          color="primary"
          @click="routeToRegisterEmployee"
        />
      </div>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {computed, inject, Ref, ref} from 'vue'
import {i18n} from 'boot/i18n';
import {inject} from 'vue'
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {MY_EMPLOYEES} from 'src/data/queries/QUERIES';
import DashboardsTable from 'components/tables/DashboardsTable.vue';


// ----- Data -----
const columns = [
  { name: 'first_name', label: i18n.global.t('account_data.first_name'), field: 'first_name', sortable: true },
  { name: 'last_name', label: i18n.global.t('account_data.last_name'), field: 'last_name', sortable: true },
  { name: 'function', label: i18n.global.t('account_data.company_function'), field: 'function', sortable: true },
  { name: 'phone', label: i18n.global.t('account_data.phone_number'), field: 'phone', sortable: false },
  { name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: false },
]
const queryResult = subscribeToQuery(MY_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>

const rows = computed(()=>{
  return queryResult.value ?? []
})


const $routerService: RouterService = inject('$routerService')

async function routeToRegisterEmployee(): Promise<void> {
  await $routerService.routeTo(ROUTES.NEW_EMPLOYEE_PAGE)
}

</script>
