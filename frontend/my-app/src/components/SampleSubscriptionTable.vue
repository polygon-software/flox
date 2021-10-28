<template>
    <q-table
       table-header-class="bg-grey-2"
       title="List of users (with subscription, additions only)"
       :rows="users"
       :columns="columns"
       row-key="id"
       :rows-per-page-options="[10,20, 100]"
    />
</template>

<script setup lang="ts">
import { USER_ADDED } from '../data/SUBSCRIPTIONS';
import { ALL_USERS } from '../data/QUERIES';
import { useSubscription } from '@vue/apollo-composable';
import { executeQuery } from '../data/data-helpers';
import {defineProps, onMounted, onServerPrefetch, Ref, ref, watch} from 'vue';
import {useStore} from "src/store";

const users: Ref<Array<any>> = ref([]);


// ----- Props -----
const props = defineProps({
  key: String
});

// ----- Data -----
const store = useStore();
let result: Ref<any>;

// ----- Hooks -----
onServerPrefetch(async () => {
  const res = await executeQuery(ALL_USERS)
  store.commit("ssr/setPrefetchedData", {key: props.key, value: res})
})
onMounted(()=>{

  users.value = store.getters['ssr/getPrefetchedData'](props.key)?.data.allUsers as Array<any>
  // Set up subscription
  result = useSubscription(USER_ADDED).subscription;
})





const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Watch for subscription changes
watch(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => result,
    (newUser) => {
      console.log(newUser)
      users.value.push(newUser.userAdded)
    }
)

// // Watch for initial state change query to go through
// const stop = watch(
//     () => initialState.value,
//     (newState) => {
//       if(users.value.length <= 0 && newState.allUsers && newState.allUsers.length > 0){
//         // Set initial state of users array
//         users.value = [...newState.allUsers]
//         // Stop the watcher as it is no longer needed
//         stop()
//       }
//     }
// )


</script>
