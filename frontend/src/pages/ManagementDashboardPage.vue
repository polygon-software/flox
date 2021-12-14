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
      <EmployeeTable/>

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
import {inject} from 'vue'
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import EmployeeTable from 'components/tables/EmployeeTable.vue';
const $routerService: RouterService|undefined = inject('$routerService')

/**
 * Routes to employee registration
 * @async
 * @returns {void}
 */
async function routeToRegisterEmployee(): Promise<void> {
  await $routerService?.routeTo(ROUTES.NEW_EMPLOYEE_PAGE)
}

</script>
