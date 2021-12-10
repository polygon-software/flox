<template>
  <q-page
    class="q-px-lg q-ma-md">

    <!-- Container for search & adding -->
    <div class="row justify-between q-ma-none">
      <h5 class="q-ma-none">
        {{ $t('dashboards.credit_institution') }}
      </h5>
      <!-- Search bar -->
      <q-input
        v-model="search"
        dense
        :label="$t('general.search')"
        outlined
        type="search"
        class="q-mb-md"
        style="margin-left: 800px"
      >
        <template #prepend>
          <q-icon name="search"/>
        </template>
      </q-input>

      <!-- Register new employee -->
      <q-btn
        icon="add"
        :label="$t('authentication.credit_institution')"
        dense
        color="primary"
        unelevated
        padding="8px"
        style="height: 40px"
        @click="routeToRegisterEmployee"
      />
    </div>

    <!-- Credit institutes Overview -->
    <CreditInstitutionTable
      class="q-mt-lg"
      :columns="columns"/>

  </q-page>
</template>

<script setup lang="ts">
import {inject} from 'vue'
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import CreditInstitutionTable from 'components/tables/CreditInstitutionTable.vue';

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
