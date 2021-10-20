<template>
  <div class="column">
<!--            v-if="users && users.length > 0"-->
    <q-table
       table-header-class="bg-grey-2"
       title="List of users (subscription)"
       :rows="users"
       :columns="columns"
       row-key="id"
       :rows-per-page-options="[10,20, 100]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
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
<!--    <q-spinner v-else TODO />-->
  </div>
</template>

<script setup lang="ts">
import { USER_ADDED } from "@/data/SUBSCRIPTIONS";
import {ALL_USERS} from "@/data/QUERIES";
import { useSubscription } from "@vue/apollo-composable";
import {ref, watch} from "vue";
import {executeQuery} from "@/data/data-helpers"; //  TODO subscription helper

const users = ref([]);


const initialQuery = executeQuery(ALL_USERS)
// console.log("Query:", initialQuery)
users.value = initialQuery.allUsers
// console.log("Blubb initial users:", initialQuery, users.value)

// Set up subscription
const result = useSubscription(USER_ADDED);


const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Subscription watcher
watch(
    result,
    data => {
      console.log("New message received:", data);
    },
    {
      lazy: true // Don't immediately execute handler
    }
);
</script>

<style scoped>

</style>
