<template>
  <q-page class="flex flex-center">
    <div
      class="q-pa-md q-ma-md"
      style="max-width: 1200px"
    >
      <!-- Own info -->
      <CompanyEmployeeId/>

      <!-- Title + search + button row -->
      <div
        class="row justify-between q-ma-none"
        style="height: 40px"
      >
        <h6 class="q-ma-none">
          {{ $t('employee_dashboard.applications') }}
          <!--          {{ $t('employee_dashboard.applications') }} ({{ rows.length }})-->
        </h6>
        <div class="row q-ma-none q-pa-none">
          <q-input
            v-model="search"
            :label="$t('general.search')"
            type="search"
            outlined
            dense
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            v-if="!employeeUuid"
            :label="$t('employee_dashboard.new_assignment')"
            color="primary"
            icon="add"
            dense
            unelevated
            padding="8px"
            style="height: 40px; border-radius: 8px; margin-left: 12px"
            @click="createDossier"
          />
        </div>
      </div>
      <div class="q-ma-md col text-center">
        <!-- Dossier Overview -->
        <EmployeeDashboardTable
          :search="search"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import EmployeeDashboardTable from 'components/tables/EmployeeDashboardTable.vue';
import CompanyEmployeeId from 'components/cards/CompanyEmployeeIdCard.vue';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useRoute} from 'vue-router';

const route = useRoute()

// Employee ID from route (if any), only relevant if going from company -> employee view
const employeeUuid = route.query.eid
const search = ref('')

const $routerService: RouterService|undefined = inject('$routerService')

/**
 * Routes to the new dossier page to add more dossiers
 * @returns {Promise<void>} - done
 */
async function createDossier(): Promise<void> {
  await $routerService?.routeTo(ROUTES.NEW_DOSSIER)
}
</script>
