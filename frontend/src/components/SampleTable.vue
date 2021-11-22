<template>
  <div class="column">
    <q-table
      v-model:selected="selected"
      table-header-class="bg-grey-2"
      title="List of users (with cache)"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      selection="single"
    >
      <template #body="props">
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
                v-slot="scope"
                :auto-save="true"
                :model-value="props.row.name"
                @save="(value) => onUpdate(props.row.uuid, {name: value})"
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
                v-slot="scope"
                :auto-save="true"
                :model-value="props.row.age"
                @save="(value) => onUpdate(props.row.uuid, {age: Number(value)})"
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
    <q-btn
        label="Löschen"
        color="negative"
        :disabled="selected.length <= 0"
        @click="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ALL_USERS } from '../data/queries/QUERIES';
import {DELETE_USER, UPDATE_USER} from '../data/MUTATIONS/USER';
import {ref, computed, Ref} from 'vue';
import {executeMutation, subscribeToQuery} from '../helpers/data-helpers';

// ----- Data -----
// Selection must be an array
let selected = ref([])
const columns = [
  { name: 'uuid', align: 'center', label: 'ID', field: 'uuid', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

const queryResult = subscribeToQuery(ALL_USERS) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

/**
 * Deletes the currently selected user
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

/**
 * Edits the given user
 * @param {string} id - the user's ID
 * @param {Record<string, unknown>} variables - the new variables
 */
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
