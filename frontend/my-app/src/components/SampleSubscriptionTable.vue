<template>
  <div class="column">
    <q-table
        v-if="result && result.allUsers"
       table-header-class="bg-grey-2"
       title="List of users (subscription)"
       :rows="result.allUsers"
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
    <q-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { USER_ADDED } from "@/data/SUBSCRIPTIONS";
import { useSubscription } from "@vue/apollo-composable";
import {watch} from "vue";
// import {executeQuery} from "@/data/data-helpers"; //  TODO subscription helper


const result = useSubscription(USER_ADDED);


const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]


watch(
    () => result,
    (newResult, oldResult) => {
      console.log("Data changed:", newResult, oldResult)
    }
)

</script>

<style scoped>

</style>
