<template>
  <q-page
    class="q-px-lg q-ma-md">
      <div class="flex row justify-center items-center">
        <p
          class="q-ma-md col"
          style="font-size: x-large; align: left"
        >
          {{ $t('dashboards.credit_institution') }}
        </p>
        <q-btn
          class="col-2 q-mx-md q-mb-md q-mt-xs"
          style="align: right"
          :label="$t('authentication.credit_institution')"
          color="primary"
          @click="routeToRegisterEmployee"
        />
      </div>

      <!-- Credit institutes Overview -->
      <EmployeeTable
        class="q-mt-lg"
        :columns="columns"/>

  </q-page>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import EmployeeTable from 'components/tables/EmployeeTable.vue';

const $routerService: RouterService = inject('$routerService')

async function routeToRegisterEmployee(): Promise<void> {
  await $routerService.routeTo(ROUTES.NEW_EMPLOYEE_PAGE)
}

const columns = [
  {name: 'id', label: i18n.global.t('account_data.id'), field: 'id', sortable: true},
  {name: 'institution', label: i18n.global.t('account_data.institution'), field: 'institution', sortable: true},
  {name: 'supervisor', label: i18n.global.t('account_data.supervisor'), field: 'supervisor', sortable: true},
  {name: 'phone', label: i18n.global.t('account_data.phone_number'), field: 'phone', sortable: false},
  {name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: false},
  {name: 'date', label: i18n.global.t('account_data.date'), field: 'date', sortable: true},
  {name: 'status', label: i18n.global.t('account_data.status'), field: 'status', sortable: true},
]

</script>
