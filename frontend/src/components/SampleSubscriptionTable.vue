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
import {onBeforeMount, onServerPrefetch, Ref, ref} from 'vue';
import { executeQuery } from '../helpers/data-helpers';
import {useSSR} from 'src/store/ssr';
import {ApolloQueryResult, FetchResult} from '@apollo/client';
import _ from 'lodash';

const users: Ref<Record<string, Record<string, unknown>[]>[]> = ref([]);

// ----- Data -----
const $ssrStore = useSSR();

// ----- Hooks -----
onServerPrefetch(async () => {
  const tempRes: ApolloQueryResult<Record<string, any>> = await executeQuery(ALL_USERS)
  if(!tempRes.data){ return}
  users.value = tempRes.data[ALL_USERS.cacheLocation] as Record<string, Record<string, unknown>[]>[]
  $ssrStore.mutations.setPrefetchedData({key: ALL_USERS.cacheLocation, value: users.value})
})
onBeforeMount(()=>{
  if(process.env.MODE === 'ssr'){
    const store_state = $ssrStore.getters.getPrefetchedData()(ALL_USERS.cacheLocation) as Record<string, Record<string, unknown>[]>[]
    if(store_state){
      // Prevent altering SSR store state when changes are made to this object
      users.value = _.cloneDeep(store_state)
    }
  } else {
    void executeQuery(ALL_USERS).then((res:ApolloQueryResult<Record<string, unknown>>)=>{
      users.value = res.data.allUsers as Record<string, Record<string, unknown>[]>[]
    })
  }
  // Set up subscription
  useSubscription(USER_ADDED).onResult((result: FetchResult<Record<string, Record<string, Record<string, unknown>[]>>>)=>{
    if(result && result.data && result.data.userAdded){
      users.value.push(result.data.userAdded)
    }
  });
})

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'uuid', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]


</script>
