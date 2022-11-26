<template>
  <q-card class="q-pa-md" flat bordered>
    <QTable
      ref="tableRef"
      v-bind="tableProps"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :title="title"
      :rows="rows"
      :columns="extendedColumns"
      row-key="uuid"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      :selection="multi ? 'multiple' : 'single'"
      :visible-columns="extendedVisibleColumnNames"
      @request="onRequest"
      @selection="handleSelection"
    >
      <template #body-cell-prepend="cellProps">
        <slot name="prepend" v-bind="cellProps" />
      </template>
      <template #body-cell-append="cellProps">
        <slot name="append" v-bind="cellProps" />
      </template>
      <template #body-cell="cellProps">
        <q-td :props="cellProps">
          {{
            cellProps.col.format
              ? cellProps.col.format(
                  get(cellProps.row, cellProps.col.field),
                  cellProps.row
                )
              : get(cellProps.row, cellProps.col.field)
          }}
          <QPopupEdit
            v-if="
              cellProps.col.edit &&
              updateMutation &&
              !cellProps.col.field.includes('.')
            "
            :ref="
              (el: any) => {
                popupRefs[getPopupEditKey(cellProps.row, cellProps.col)] = el;
              }
            "
            v-slot="scope"
            buttons
            :validate="validateInput(cellProps.col)"
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
          </QPopupEdit>
        </q-td>
      </template>
      <template #header-selection="scope">
        <q-checkbox v-model="scope.selected" />
      </template>

      <template #body-selection="scope">
        <q-checkbox
          :model-value="scope.selected"
          @update:model-value="scope.selected = $event"
        />
      </template>
      <template #top-right="headerProps">
        <q-input
          v-if="!hideSearch"
          v-model="filter"
          borderless
          hide-bottom-space
          dense
          debounce="300"
          :placeholder="$t('general.search')"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-if="!hideColumnSelector"
          v-model="visibleColumnNames"
          borderless
          multiple
          dense
          hide-bottom-space
          :display-value="$t('general.display')"
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
          v-if="!hideFullscreen"
          flat
          round
          dense
          :icon="headerProps.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          class="q-ml-md"
          @click="headerProps.toggleFullscreen"
        />
      </template>
    </QTable>
    <div class="row">
      <div class="col">
        <div
          v-if="multi"
          class="text-subtitle2 q-pa-sm"
          v-text="$t('table.ctrl_shift_hint')"
        />
      </div>
      <div class="col">
        <div class="row justify-end" style="gap: 10px">
          <q-btn
            v-if="selected.length > 0 && exportSelection"
            color="primary"
            icon-right="file_download"
            label="Export"
            no-caps
            @click="exportTable"
          />
          <ConfirmButton
            v-if="selected.length > 0 && deleteSelection && deleteMutation"
            :label="removeLabel"
            :confirm-label="$t('general.confirm')"
            :button-props="{
              color: 'negative',
              iconRight: removeIcon,
              noCaps: true,
            }"
            @click="deleteActiveRows"
          />
          <slot name="actions" :selected="selected" />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { QPopupEdit, QTable, QTableProps } from 'quasar';
import {
  computed,
  ComputedRef,
  defineProps,
  onMounted,
  Ref,
  ref,
  watch,
  watchEffect,
} from 'vue';
import get from 'lodash/get';

import {
  ColumnAlign,
  ColumnInterface,
  useDataTable,
} from 'components/tables/useDataTable';
import { MutationObject } from 'src/apollo/mutation';
import { QueryObject } from 'src/apollo/query';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import ConfirmButton from 'components/buttons/ConfirmButton.vue';
import { ValidationRule } from 'src/tools/validation.tool';

const props = withDefaults(
  defineProps<{
    query: QueryObject;
    updateMutation?: MutationObject;
    deleteMutation?: MutationObject;
    columns: ColumnInterface<BaseEntity>[];
    tableProps?: QTableProps;
    title?: string;
    exportSelection?: boolean;
    deleteSelection?: boolean;
    hideFullscreen?: boolean;
    hideSearch?: boolean;
    hideColumnSelector?: boolean;
    prependSlot?: boolean;
    prependName?: string;
    appendSlot?: boolean;
    appendName?: string;
    multi?: boolean;
    removeIcon?: string;
    removeLabel?: string;
  }>(),
  {
    updateMutation: undefined,
    deleteMutation: undefined,
    title: undefined,
    exportSelection: false,
    deleteSelection: false,
    multi: false,
    hideFullscreen: false,
    hideSearch: false,
    prependSlot: false,
    appendSlot: false,
    hideColumnSelector: false,
    removeIcon: 'delete',
    removeLabel: 'Remove',
    appendName: '',
    prependName: '',
    tableProps: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'update:selected', selected: BaseEntity[]): void;
}>();

const popupRefs: Ref<Record<string, QPopupEdit>> = ref({});

/**
 * Generates an index key for a popup referenec
 *
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
 *
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
        return (rule as ValidationRule)(value) === true;
      }
      return true;
    });
  };
}

watch(selected, (val) => {
  emit('update:selected', val);
});

watchEffect(() => {
  columns.value = props.columns;
});

const extendedColumns: ComputedRef<ColumnInterface<BaseEntity>[]> = computed(
  () => {
    const prependContent = {
      name: 'prepend',
      align: ColumnAlign.left,
      field: 'prepend',
      label: props.prependName ?? '',
    };
    const appendContent = {
      name: 'append',
      field: 'append',
      label: props.appendName ?? '',
    };
    return [
      ...(props.prependSlot ? [prependContent] : []),
      ...props.columns,
      ...(props.appendSlot ? [appendContent] : []),
    ];
  }
);
const extendedVisibleColumnNames: ComputedRef<string[]> = computed(() => {
  return [
    ...(props.prependSlot ? ['prepend'] : []),
    ...visibleColumnNames.value,
    ...(props.appendSlot ? ['append'] : []),
  ];
});

onMounted(() => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction();
  }
});

/**
 * Refreshes the content of the table by requesting a server interaction
 */
function refresh(): void {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction();
  }
}

defineExpose({
  refresh,
  rows,
});
</script>
