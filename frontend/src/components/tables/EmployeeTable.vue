<template>
  <div class="column">
    <q-table
      table-header-class="bg-grey-2"
      title="Employees"
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


// ----- Data -----
const columns = [
  { name: 'uuid', align: 'center', label: 'ID', field: 'uuid', sortable: false },
  { name: 'first_name', label: 'First Name', field: 'first_name', sortable: true },
  { name: 'last_name', label: 'Last Name', field: 'last_name', sortable: true },
  { name: 'function', label: 'Function', field: 'function', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', sortable: false },
  { name: 'email', label: 'E-Mail', field: 'email', sortable: false },
]

const queryResult = subscribeToQuery(ALL_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

</script>
