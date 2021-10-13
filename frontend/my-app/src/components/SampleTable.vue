<template>
  <q-table v-if="result && result.allUsers"
           table-header-class="bg-grey-2"
           title="List of users"
           :rows="result.allUsers"
           :columns="columns"
           row-key="id"
           :rows-per-page-options="[10,20, 100]"
  />
  <q-spinner v-else />
</template>

<script setup lang="ts">
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";

const { result } = useQuery(gql`
      query{
        allUsers{
          id
          name
          age
        }
      }
    `)

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]


</script>

<style scoped>

</style>
