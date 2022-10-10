<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :title="title"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
  >
    <template #top-left>
      <q-btn
        color="primary"
        icon-right="archive"
        label="Export to csv"
        no-caps
        @click="exportTable"
      />
    </template>
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
import {ref, onMounted, Ref} from 'vue';
import {QTable} from 'quasar';
import {useDataTable} from 'components/tables/useDataTable';
import {User} from 'src/data/types/User';
import { QUERY_USERS } from 'src/data/queries/USER';

const title = 'User Table';

const tableRef: Ref<QTable|null> = ref(null)
const { rows, columns, filter, loading, pagination, onRequest, exportTable } = useDataTable<User>(QUERY_USERS);

columns.value = [
  { name: 'uuid', label: 'uuid', field: 'uuid', sortable: true },
  { name: 'username', label: 'Username', field: (user: User) => user.username, sortable: true },
  { name: 'email', label: 'E-Mail', field: (user: User) => user.email, sortable: true },
  { name: 'role', label: 'Role', field: (user: User) => user.role, sortable: true },
]

onMounted(() => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
})

</script>

<style scoped>

</style>
