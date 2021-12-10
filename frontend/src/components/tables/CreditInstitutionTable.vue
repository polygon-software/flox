<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      :filter="search"
      flat
    >
      <template #body="props">
        <q-tr
          :props="props"
          style="background-color: white; cursor: pointer"
          @click="() => onRowClick(props.row)"
        >
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="institution" :props="props">
            {{ props.row.institution }}
          </q-td>
          <q-td key="supervisor" :props="props">
            {{ props.row.supervisor }}
          </q-td>
          <q-td key="phone" :props="props">
            {{ props.row.phone }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="status" :props="props">
            <q-icon name="circle" :color="props.row.status? 'green' : 'red'" size="md"/>
          </q-td>
        </q-tr>
        <!-- One spacer row per row -->
        <q-tr style="height: 14px"/>
      </template>
    </q-table>
  </div>
</template>


<script setup lang="ts">
import {ref, computed, defineProps, Ref} from 'vue';
import {MY_EMPLOYEES} from 'src/data/queries/QUERIES';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {DELETE_USER, UPDATE_USER} from 'src/data/mutations/USER';


// ----- Data -----
// Selection must be an array
let selected = ref([])

const props = defineProps({
  columns: {
    required: true,
    type: Array,
    default: () => [],
  },
})
const queryResult = subscribeToQuery(MY_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>
const computedResult = computed(() => {
  return queryResult.value ?? []
})

/**
 * Deletes the currently selected user
 */
function onDelete() {
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
function onUpdate(id: string, variables: Record<string, unknown>) {
  void executeMutation(
    UPDATE_USER,
    {
      uuid: id,
      ...variables
    }
  )
}


</script>
