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
        style="margin-left: 30px;"
      >
        <template #prepend>
          <q-icon name="search"/>
        </template>
      </q-input>

      <!-- Register new bank -->
      <q-btn
        icon="add"
        :label="$t('authentication.credit_institution')"
        dense
        color="primary"
        unelevated
        padding="8px"
        style="height: 40px"
        @click="routeToRegisterBank"
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

async function routeToRegisterBank(): Promise<void> {
  await $routerService.routeTo(ROUTES.NEW_EMPLOYEE_PAGE)
}

const columns = [
  {name: 'first_name', label: i18n.global.t('account_data.first_name'), field: 'first_name', sortable: true},
  {name: 'last_name', label: i18n.global.t('account_data.last_name'), field: 'last_name', sortable: true},
  {name: 'email', label: i18n.global.t('account_data.email'), field: 'email', sortable: false},
  {name: 'address', label: i18n.global.t('account_data.address'), field: 'address', sortable: true},
  {name: 'offer', label: i18n.global.t('account_data.offer'), field: 'offers', sortable: true},
  {name: 'status', label: i18n.global.t('account_data.status'), field: 'offers.dossier.status', sortable: true},
]

</script>
