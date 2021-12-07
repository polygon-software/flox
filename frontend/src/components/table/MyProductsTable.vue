<template>
  <div class="column full-width">
    <q-table
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      :filter="search"
      flat
      bordered
    >
      <template #body="props">
        <q-tr
          :props="props"
          class="q-ma-none q-pa-none"
          style="cursor: pointer"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="uuid" :props="props">
            <img
              :src="props.row.pictures[0].url"
              style="max-width: 120px; height: 90px"
            >
          </q-td>
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
            {{ formatDate(new Date(props.row.start)) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {MY_PRODUCTS} from 'src/data/queries/QUERIES';

const props = defineProps( {
  search: {
    required: true,
    type: String,
  }
})

// TODO i18n
const columns = [
  { name: 'uuid', label: '', field: 'uuid', sortable: true },
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
  //TODO open Edit dialog?
  console.log('row clicked', row)
}


</script>
