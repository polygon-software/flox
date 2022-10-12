<template>
  <q-card class="q-pa-md">
    <q-table
      ref="tableRef"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      selection="multiple"
      :visible-columns="visibleColumnNames"
      @request="onRequest"
      @selection="handleSelection"
    >
      <template #body-cell="props">
        <q-td :props="props">
          {{ props.row[props.col.field] }}
          <q-popup-edit
            v-if="props.col.edit"
            v-slot="scope"
            :model-value="props.row[props.col.field]"
            buttons
            @save="updateRow(props.row, props.col.field, $event)"
          >
            <q-input v-model="scope.value" v-bind="props.col.editProps" dense autofocus counter />
          </q-popup-edit>
        </q-td>
      </template>
      <template #header-selection="scope">
        <q-checkbox v-model="scope.selected" />
      </template>

      <template #body-selection="scope">
        <q-checkbox :model-value="scope.selected" @update:model-value="(val, evt) => { Object.getOwnPropertyDescriptor(scope, 'selected').set(val, evt) }" />
      </template>
      <template #top-right="props">
        <q-input v-model="filter" borderless hide-bottom-space dense debounce="300" placeholder="Search">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-model="visibleColumnNames"
          borderless
          multiple
          dense
          hide-bottom-space
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          class="q-mx-lg"
        >
          <template #option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label v-html="opt.label" />
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          class="q-ml-md"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>
    <div class="row">
      <div class="col">
        <div class="text-subtitle2 q-pa-sm">Hint: Use <kbd>SHIFT</kbd> to select / deselect a range and <kbd>CTRL</kbd> to add to selection</div>
      </div>
      <div class="col">
        <div class="row justify-end" style="gap: 10px">
          <q-btn
            v-if="selected.length > 0"
            color="primary"
            icon-right="file_download"
            label="Export"
            no-caps
            @click="exportTable"
          />
          <q-btn
            v-if="selected.length > 0"
            color="negative"
            icon-right="delete"
            label="Delete"
            no-caps
            @click="deleteActiveRows"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {ref, onMounted, Ref} from 'vue';
import {QTable} from 'quasar';
import {useDataTable} from 'components/tables/useDataTable';
import {User} from 'src/data/types/User';
import { QUERY_USERS } from 'src/data/queries/USER';
import {DELETE_USER, UPDATE_USER} from "src/data/mutations/USER";

const title = 'User Table';

const tableRef: Ref<QTable|null> = ref(null)
const { rows, columns, selected, visibleColumnNames, filter, loading, pagination, onRequest, exportTable, handleSelection, updateRow, deleteActiveRows } = useDataTable<User>(QUERY_USERS, UPDATE_USER, DELETE_USER);

columns.value = [
  { name: 'uuid', label: 'UUID', field: 'uuid', sortable: true, edit: true },
  { name: 'username', label: 'Username', field: 'username', sortable: true, edit: true },
  { name: 'email', label: 'E-Mail', field: 'email', sortable: true, edit: true },
  { name: 'role', label: 'Role', field: 'role', sortable: true },
]

onMounted(() => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
})

</script>

<style scoped>
kbd {
  white-space: nowrap;
  display: inline-block;
  padding: 2px 4px 4px;
  line-height: 1;
  font-size: .8em;
  color: #616161;
  background: linear-gradient(-225deg,#d5dbe4,#f8f8f8);
  border-radius: 4px;
  box-shadow: inset 0 -2px #cdcde6, inset 0 0 1px 1px #fff, 0 1px 2px 1px #1e235a66;
  margin: 0 0.2em;
}
</style>
