<template>
    <q-table
       table-header-class="bg-grey-2"
       title="List of newly added users (subscription)"
       :rows="users"
       :columns="columns"
       row-key="id"
       :rows-per-page-options="[10,20, 100]"
    />
</template>

<script setup lang="ts">
import { USER_ADDED } from "@/data/SUBSCRIPTIONS";
import { useSubscription } from "@vue/apollo-composable";
import {ref, watch} from "vue";

const users = ref([]);

// Set up subscription
const {result} = useSubscription(USER_ADDED);


const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Watch for subscription changes
watch(
    () => result.value,
    (newUser) => {
      users.value.push(newUser.userAdded)
    }
)
</script>

<style scoped>

</style>
