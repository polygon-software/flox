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
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit
                :auto-save="true"
                :model-value="props.row.name"
                @save="(value) => onUpdate(props.row.id, {name: value})"
                v-slot="scope"
            >
              <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="age" :props="props">
            {{ props.row.age }}
            <q-popup-edit :model-value="props.row.age">
              <q-input
                  :model-value="props.row.age"
                  dense
                  autofocus
                  counter
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
import {DELETE_USER, UPDATE_USER} from "@/data/MUTATIONS";
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

function onUpdate(id, variables){
  console.log("Update user", id, "with", variables)
  executeMutation(
      UPDATE_USER,
      {
        id: id,
        ...variables
      }
  )
}

</script>

<style scoped>

</style>
