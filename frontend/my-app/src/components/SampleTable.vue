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
import { ALL_USERS } from "@/data/QUERIES";
import {DELETE_USER} from "@/data/MUTATIONS";
import {ref} from "vue";
import {executeMutation, executeQuery} from "@/data/data-helpers";

const result = executeQuery(ALL_USERS)

const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Selection must be an array
let selected = ref([])

/**
 * Deletes the currently selected user
 */
function onDelete(){
  executeMutation(
      DELETE_USER,
      {
        id: selected.value[0].id
      }
  ).then(() => {
    selected.value = []
  })
}

</script>

<style scoped>

</style>
