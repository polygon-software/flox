<template>
  <div class="column">
    <q-table
        v-if="result && result.allUsers"
       table-header-class="bg-grey-2"
       title="List of users (with cache)"
       :rows="result.allUsers"
       :columns="columns"
       row-key="uuid"
       :rows-per-page-options="[10,20, 100]"
       v-model:selected="selected"
       selection="single"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox
                v-model="props.selected"
            />
          </q-td>
          <q-td key="uuid" :props="props">
            {{ props.row.uuid }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit
                :auto-save="true"
                :model-value="props.row.name"
                @save="(value) => onUpdate(props.row.uuid, {name: value})"
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
            <q-popup-edit
                :auto-save="true"
                :model-value="props.row.age"
                @save="(value) => onUpdate(props.row.uuid, {age: Number(value)})"
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
import { ALL_USERS } from '../data/QUERIES';
import {DELETE_USER, UPDATE_USER} from '../data/MUTATIONS';
import {ref} from 'vue';
import {executeMutation, executeQuery} from '../helpers/data-helpers';

const result = executeQuery(ALL_USERS)

const columns = [
  { name: 'uuid', align: 'center', label: 'ID', field: 'uuid', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

// Selection must be an array
let selected = ref([])

/**
 * Deletes the currently selected authentication
 */
function onDelete(){
  void executeMutation(
      DELETE_USER,
      {
        uuid: selected.value[0].uuid
      }
  ).then(() => {
    selected.value = []
  })
}

function onUpdate(id: string, variables: Record<string, unknown>){
  void executeMutation(
      UPDATE_USER,
      {
        uuid: id,
        ...variables
      }
  )
}

</script>
