<template>
  <div class="column">
    <q-table
        v-if="result && result.allUsers"
       table-header-class="bg-grey-2"
       title="List of users (with cache)"
       :rows="result.allUsers"
       :columns="columns"
       row-key="id"
       :rows-per-page-options="[10,20, 100]"
        selection="single"
        v-model:selected="selected"
    />
    <q-spinner v-else />
    <q-btn
        label="Löschen"
        color="negative"
        :disabled="selected.length <= 0"
        @click="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import {useMutation, useQuery} from "@vue/apollo-composable";
import { ALL_USERS } from "@/data/QUERIES";
import {DELETE_USER} from "@/data/MUTATIONS";
import {ref} from "vue";

const { result } = useQuery(ALL_USERS.query)

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Selection must be an array
let selected = ref([])

// "Delete" Mutation TODO use func
const { mutate: deleteUser } = useMutation(DELETE_USER, () => ({
  update: (cache, { data: { remove } }) => {
    let data = cache.readQuery({ query: ALL_USERS })
    // Remove on cache
    cache.writeQuery({ query: ALL_USERS, data: {
      ...data,
        allUsers: data.allUsers.filter(user => user.id !== remove.id)
      }
    })
  },
}))

/**
 * Deletes the currently selected user
 */
function onDelete(){
  console.log("Delete", selected.value[0])
  deleteUser({
    id: selected.value[0].id
  }).then(() => {
    selected.value = []
  })
}

</script>

<style scoped>

</style>
