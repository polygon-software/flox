<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      table-header-class="bg-grey-2"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {MY_CUSTOMERS} from 'src/data/queries/QUERIES';
import {i18n} from 'boot/i18n';


// ----- Data -----
const columns = [
  { name: 'date', label: i18n.global.t('employee_dashboard.date'), field: 'date', sortable: true },
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'customer', sortable: true },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'institute', sortable: true },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true },
  { name: 'mortage amount', label: i18n.global.t('employee_dashboard.mortage_amount'), field: 'mortage amount', sortable: true },
  { name: 'status', label: i18n.global.t('employee_dashboard.status'), field: 'status', sortable: false },
  { name: 'offers', label: i18n.global.t('employee_dashboard.offers'), field: 'offers', sortable: false },
]

const queryResult = subscribeToQuery(MY_CUSTOMERS) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

</script>
