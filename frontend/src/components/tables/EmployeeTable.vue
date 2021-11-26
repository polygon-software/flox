<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      table-header-class="bg-grey-2"
      :title="$t('employees')"
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
import {ALL_EMPLOYEES} from 'src/data/queries/QUERIES';
import {i18n} from 'boot/i18n';


// ----- Data -----
const columns = [
  { name: 'first_name', label: i18n.global.t('first_name'), field: 'first_name', sortable: true },
  { name: 'last_name', label: i18n.global.t('last_name'), field: 'last_name', sortable: true },
  { name: 'function', label: i18n.global.t('company_function'), field: 'function', sortable: true },
  { name: 'phone', label: i18n.global.t('phone_number'), field: 'phone', sortable: false },
  { name: 'email', label: i18n.global.t('email'), field: 'email', sortable: false },
]

const queryResult = subscribeToQuery(ALL_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  console.log('Got result:', queryResult.value)
  return queryResult.value ?? []
})

</script>
