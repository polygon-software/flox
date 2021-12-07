<template>
  <div class="column">
    <q-table
      table-header-class="bg-grey-2"
      title="TODO kein titel oder so"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="uuid" :props="props">
            {{ props.row.uuid }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="age" :props="props">
            {{ props.row.age }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {MY_PRODUCTS} from 'src/data/queries/QUERIES';

// ----- Data -----
// Selection must be an array
let selected = ref([])
const columns = [
  { name: 'uuid', align: 'center', label: 'ID', field: 'uuid', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

const queryResult = subscribeToQuery(MY_PRODUCTS) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

/**
 * Deletes the currently selected user
 */
function onRowClick(row: Record<string, any>){
  //TODO
  console.log('row clicked', row)
}


</script>
