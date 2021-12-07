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
        <q-tr
          :props="props"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="brand" :props="props">
            {{ props.row.brand }}
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.status }}
          </q-td>
          <q-td key="sponsored" :props="props">
            <!-- TODO i18n -->
            {{ props.row.sponsored ? 'Sponsored' : 'Normal' }}
          </q-td>
          <q-td key="start" :props="props">
            {{ props.row.start }}
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

// TODO i18n
const columns = [
  { name: 'title', label: 'Product', field: 'title', sortable: true },
  { name: 'brand', label: 'Brand', field: 'brand', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  { name: 'sponsored', label: 'Type', field: 'sponsored', sortable: true },
  { name: 'start', label: 'Start Date', field: 'start', sortable: true },
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
