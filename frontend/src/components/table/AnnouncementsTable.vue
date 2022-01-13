<template>
  <div class="column full-width">
    <q-table
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10, 20, 100]"
      :filter="search"
      flat
      bordered
    />
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {ALL_PLAYERS} from 'src/data/queries/USER';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps( {
  search: {
    required: true,
    type: String,
  },
})

// TODO i18n
const columns = [
  { name: 'title', label: 'Title', field: 'title', sortable: true, align: 'center' },
  { name: 'content', label: 'Content', field: 'content', sortable: true, align: 'center' },
  { name: 'userRole', label: 'User Role', field: 'userRole', sortable: true, align: 'center' },
  { name: 'date', label: 'Date', field: (date: string) => date ? formatDate(new Date(date)) : '-', sortable: true, align: 'center' },
]

const queryResult = subscribeToQuery(ALL_PLAYERS) as Ref<Array<Record<string, unknown>>>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  return queryResult.value ?? []
})

</script>
