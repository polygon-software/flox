<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :title="title"
    :rows="rows"
    :columns="props.columns"
    row-key="id"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
  >
    <template #top-right>
      <q-input v-model="filter" borderless dense debounce="300" placeholder="Search">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

  </q-table>
</template>

<script setup lang="ts">
import {ref, onMounted, Ref, defineProps} from 'vue';
import {QTable} from 'quasar';
import {executeQuery} from 'src/helpers/data/data-helpers';
import { QUERY_USERS } from 'src/data/queries/USER';

const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  columns: {
    required: true,
    type: Array,
    default: () => ([]),
  },
})

const tableRef: Ref<QTable|null> = ref(null)
const rows: Ref<Array<Record<string, any>>> = ref([])
const filter: Ref<string> = ref('')
const loading: Ref<boolean> = ref(false)
const pagination: Ref<{sortBy: string, descending: boolean, page: number, rowsPerPage: number, rowsNumber: number}> = ref({
  sortBy: 'uuid',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

/**
 * Fetches Data from the Server
 * @param {number} skip - how many items to skip
 * @param {number} limit - how many items to take
 * @param {string} filter - search input
 * @param {string} sortBy - attribute name
 * @param {boolean} descending - sort order
 * @returns {Promise<{ data: Object<string, any>[], count: number }>} rows from server and count of total rows fitting criteria
 */
async function fetchFromServer<T> (skip: number, limit: number, filter: string, sortBy: string, descending: boolean) {
  const queryResult = await executeQuery(QUERY_USERS, { skip, limit, filter, sortBy, descending });
  const data = queryResult.data[QUERY_USERS.cacheLocation] as unknown as { data: T[], count: number };
  return {
    data: data.data ,
    count: data.count,
  };
}


/**
 * Loads new data from server
 * @param {{ pagination: { page: number, rowsPerPage: number, sortBy: string, descending: boolean }, filter: string }} dataProps - props input
 * @returns {Promise<void>}
 */
async function onRequest (dataProps: { pagination: { page: number, rowsPerPage: number, sortBy: string, descending: boolean }, filter: string }) {
  const { filter } = dataProps;
  const { page, rowsPerPage, sortBy, descending } = dataProps.pagination;

  loading.value = true;

  const startRow = (page - 1) * rowsPerPage;

  const { count, data } = await fetchFromServer(startRow, rowsPerPage, filter, sortBy, descending);
  pagination.value.rowsNumber = count;

  rows.value.splice(0, rows.value.length, ...data);

  // don't forget to update local pagination object
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  // ...and turn of loading indicator
  loading.value = false;
}

onMounted(() => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
})

</script>

<style scoped>

</style>
