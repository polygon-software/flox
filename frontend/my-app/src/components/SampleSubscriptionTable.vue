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
import {onMounted, onServerPrefetch, Ref, ref} from 'vue';
import {useStore} from "src/store";

const users: Ref<Array<any>> = ref([]);




// ----- Data -----
const store = useStore();

// ----- Hooks -----
onServerPrefetch(async () => {
  const temp_res = await executeQuery(ALL_USERS)
  store.commit("ssr/setPrefetchedData", {key: ALL_USERS.cacheLocation, value: temp_res.data[ALL_USERS.cacheLocation]})
})
onMounted(()=>{
  if(process.env.MODE === "ssr"){
    users.value = []
    users.value.push(...store.getters['ssr/getPrefetchedData'](ALL_USERS.cacheLocation))
  } else {
    void executeQuery(ALL_USERS).then((res)=>{
      users.value = [...res.data.allUsers]
    })
  }
  // Set up subscription
  useSubscription(USER_ADDED).onResult((res)=>{
    users.value.push(res.data.userAdded)
  });
})





const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]
//
// // Watch for subscription changes
// watch(
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     () => result,
//     (newUser) => {
//       console.log(newUser)
//       users.value.push(newUser.userAdded)
//     }
// )

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
