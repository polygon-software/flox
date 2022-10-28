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
      <template #body-cell="cellProps">
        <q-td :props="cellProps">
          {{ cellProps.row[cellProps.col.field] }}
          <q-popup-edit
            v-if="cellProps.col.edit"
            :ref="
              (el) => {
                popupRefs[getPopupEditKey(cellProps.row, cellProps.col)] = el;
              }
            "
            v-slot="scope"
            buttons
            :validate="validateInput(cellProps.col, $event)"
            :model-value="cellProps.row[cellProps.col.field]"
            :label-set="$t('general.save')"
            :label-cancel="$t('general.cancel')"
            @keyup.enter="
              popupRefs[getPopupEditKey(cellProps.row, cellProps.col)].set()
            "
            @save="updateRow(cellProps.row, cellProps.col.field, $event)"
          >
            <q-input
              v-model="scope.value"
              v-bind="cellProps.col.qInputProps"
              dense
              autofocus
              counter
            />
          </q-popup-edit>
        </q-td>
      </template>
      <template #header-selection="scope">
        <q-checkbox v-model="scope.selected" />
      </template>

      <template #body-selection="scope">
        <q-checkbox
          :model-value="scope.selected"
          @update:model-value="
            (val, evt) => {
              Object.getOwnPropertyDescriptor(scope, 'selected').set(val, evt);
            }
          "
        />
      </template>
      <template #top-right="headerProps">
        <q-input
          v-model="filter"
          borderless
          hide-bottom-space
          dense
          debounce="300"
          placeholder="Search"
        >
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
          <template
            #option="{ itemProps, opt, selected: isSelected, toggleOption }"
          >
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label>
                  {{ opt.label }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :model-value="isSelected"
                  @update:model-value="toggleOption(opt)"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          flat
          round
          dense
          :icon="headerProps.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          class="q-ml-md"
          @click="headerProps.toggleFullscreen"
        />
      </template>
    </q-table>
    <div class="row">
      <div class="col">
        <div
          class="text-subtitle2 q-pa-sm"
          v-text="$t('table.ctrl_shift_hint')"
        />
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
import { ColumnInterface, useDataTable } from 'components/tables/useDataTable';
import { QPopupEdit, QTable } from 'quasar';
import { MutationObject } from 'src/apollo/mutation';
import { QueryObject } from 'src/apollo/query';
import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';
import { defineProps, onMounted, Ref, ref, watchEffect } from 'vue';

const props = defineProps<{
  title: string;
  query: QueryObject;
  updateMutation: MutationObject;
  deleteMutation: MutationObject;
  columns: ColumnInterface<BaseEntity>[];
}>();

const popupRefs: Ref<Record<string, QPopupEdit>> = ref({});

/**
 * Generates an index key for a popup referenec
 * @param row - row of data in which popup edit occurs
 * @param col column in which popup edit occurs
 * @returns popup key
 */
function getPopupEditKey(
  row: BaseEntity,
  col: ColumnInterface<BaseEntity>
): string {
  return `${row.uuid}-${col.name}`;
}

const tableRef: Ref<QTable | null> = ref(null);
const {
  rows,
  columns,
  selected,
  visibleColumnNames,
  filter,
  loading,
  pagination,
  onRequest,
  exportTable,
  handleSelection,
  updateRow,
  deleteActiveRows,
} = useDataTable<BaseEntity>(
  props.query,
  props.updateMutation,
  props.deleteMutation
);

/**
 * Validates an input for qPopupEdit
 * @param column - currently edited column
 * @returns function that validates input
 */
function validateInput(column: ColumnInterface): (value: any) => boolean {
  return (value: any) => {
    if (!column?.qInputProps?.rules) {
      return true;
    }
    return column?.qInputProps?.rules.every((rule) => {
      if (typeof rule === 'function') {
        return rule(value) === true;
      } else {
        return true;
      }
    });
  };
}

watchEffect(() => {
  columns.value = props.columns;
});

onMounted(() => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction();
  }
});
</script>
