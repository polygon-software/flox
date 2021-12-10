<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      :filter="search"
      flat
    >
      <template #body="props">
        <q-tr
          :props="props"
          style="background-color: white; cursor: pointer"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="first_name" :props="props">
            {{ props.row.first_name }}
          </q-td>
          <q-td key="last_name" :props="props">
            {{ props.row.last_name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
          <q-td key="offers" :props="props">
            {{ props.row.offers }}
          </q-td>
          <q-td key="status" :props="props">
            <q-icon name="circle" :color="props.row.status? 'green' : 'red'" size="md"/>
          </q-td>
        </q-tr>
        <!-- One spacer row per row -->
        <q-tr style="height: 14px"/>
      </template>
    </q-table>
  </div>
</template>


<script setup lang="ts">
import {ref, computed, defineProps, Ref} from 'vue';
import {ALL_BANKS} from 'src/data/queries/QUERIES';
import {subscribeToQuery} from 'src/helpers/data-helpers';


// ----- Data -----
// Selection must be an array
let selected = ref([])

const props = defineProps({
  columns: {
    required: true,
    type: Array,
    default: () => [],
  },
})
const queryResult = subscribeToQuery(ALL_BANKS) as Ref<Record<string, Array<Record<string, unknown>>>>
const computedResult = computed(() => {
  return queryResult.value ?? []
})


</script>
