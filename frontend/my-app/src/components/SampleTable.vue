<template>
  <div class="column">
    <q-table
      v-if="computedResult"
      table-header-class="bg-grey-2"
      title="List of users (with cache)"
      :rows="computedResult"
      :columns="columns"
      row-key="id"
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
            <q-popup-edit
                :auto-save="true"
                :model-value="props.row.age"
                @save="(value) => onUpdate(props.row.id, {age: Number(value)})"
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
import {ref, computed, ComputedRef} from 'vue';
import {executeMutation, subscribeToQuery} from '../data/data-helpers';



// ----- Data -----
// Selection must be an array
let selected = ref([])
const columns = [
  { name: 'id', align: 'center', label: 'ID', field: 'id', sortable: false },
  { name: 'name', label: 'Name', field: 'name', sortable: true },
  { name: 'age', label: 'Age (years)', field: 'age', sortable: true },
]

const queryResult = subscribeToQuery(ALL_USERS) as ComputedRef<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
    return queryResult.value?.allUsers ?? []
})




/**
 * Deletes the currently selected authentication
 */
function onDelete(){
  void executeMutation(
      DELETE_USER,
      {
        id: selected.value[0].id
      }
  ).then(() => {
    selected.value = []
  })
}

function onUpdate(id: string, variables: Record<string, unknown>){
  void executeMutation(
      UPDATE_USER,
      {
        id: id,
        ...variables
      }
  )
}

</script>
