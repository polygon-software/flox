<template>
    <q-table
       table-header-class="bg-grey-2"
       title="List of users (with subscription, additions only)"
       :rows="users"
       :columns="columns"
       row-key="uuid"
       :rows-per-page-options="[10,20, 100]"
    />
</template>

<script setup lang="ts">
import { USER_ADDED } from '../data/SUBSCRIPTIONS';
import { ALL_USERS } from '../data/QUERIES';
import { useSubscription } from '@vue/apollo-composable';
import { executeQuery } from '../helpers/data-helpers';
import {Ref, ref, watch} from 'vue';

const users: Ref<Record<string, unknown>[]> = ref([]);

// Set up initial query
const initialState = executeQuery(ALL_USERS);

// Set up subscription
const { result } = useSubscription(USER_ADDED);

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'uuid', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Watch for subscription changes
watch(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => result.value,
    (newUser: Record<string, unknown>) => {
      users.value.push(newUser.userAdded)
    }
)

// Watch for initial state change query to go through
const stop = watch(
    () => initialState.value,
    (newState: Record<string, Record<string, unknown>[]>) => {
      if(users.value.length <= 0 && newState.allUsers && newState.allUsers.length > 0){
        // Set initial state of users array
        users.value = [...newState.allUsers]
        // Stop the watcher as it is no longer needed
        stop()
      }
    }
)


</script>
