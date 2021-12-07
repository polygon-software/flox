<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      table-header-class="bg-grey-2"
      :title="$t('account_data.employees')"
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
import {MY_EMPLOYEES} from 'src/data/queries/QUERIES';
import {i18n} from 'boot/i18n';


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

</script>
