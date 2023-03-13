<template>
  <q-card bordered class="q-pa-md" flat>
    <QTable
      ref="tableRef"
      v-model:pagination="pagination"
      v-model:selected="selected"
      :columns="extendedColumns"
      :filter="filter"
      :loading="loading"
      :rows="rows"
      :selection="multi ? 'multiple' : 'single'"
      :title="title"
      :visible-columns="extendedVisibleColumnNames"
      binary-state-sort
      row-key="uuid"
      v-bind="tableProps"
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
              : isString(cellProps.col.field)
              ? get(cellProps.row, cellProps.col.field)
              : cellProps.col.field(cellProps.row)
          }}
          <!--
          If the column field path contains a dot, it is a property of a nested object
          and should / can hence not be edited directly.
          -->
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
            :label-cancel="$t('general.cancel')"
            :label-set="$t('general.save')"
            :model-value="cellProps.row[cellProps.col.field]"
            :validate="validateInput(cellProps.col)"
            buttons
            @save="updateRow(cellProps.row, cellProps.col.field, $event)"
            @keyup.enter="
              popupRefs[getPopupEditKey(cellProps.row, cellProps.col)].set()
            "
          >
            <q-input
              v-model="scope.value"
              autofocus
              counter
              dense
              v-bind="cellProps.col.qInputProps"
            />
          </QPopupEdit>
        </q-td>
      </template>
      <template #body-cell-options="cellProps">
        <q-td :props="cellProps">
          <q-btn
            v-if="optionsMenu"
            :disable="selected.length > 0"
            color="grey"
            flat
            icon="more_vert"
            square
            @click.stop
          >
            <q-menu>
              <div class="column">
                <slot :row="cellProps.row" name="options" />
                <ConfirmButton
                  v-if="deleteSelection && deleteMutation"
                  :button-props="{
                    color: 'negative',
                    iconRight: removeIcon,
                    noCaps: true,
                    noWrap: true,
                  }"
                  :confirm-label="$t('general.confirm')"
                  :label="removeLabel ?? $t('general.remove')"
                  @click="() => deleteRow(cellProps.row)"
                />
              </div>
            </q-menu>
          </q-btn>
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
          :placeholder="$t('general.search')"
          borderless
          debounce="300"
          dense
          hide-bottom-space
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-if="!hideColumnSelector"
          v-model="visibleColumnNames"
          :display-value="$t('general.display')"
          :options="columns"
          borderless
          class="q-mx-lg"
          dense
          emit-value
          hide-bottom-space
          map-options
          multiple
          option-value="name"
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
          :icon="headerProps.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          class="q-ml-md"
          dense
          flat
          round
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
          <slot :selected="selected" name="actions" />
          <q-btn
            v-if="selected.length > 0 && exportSelection"
            :label="$t('general.export')"
            color="primary"
            icon-right="file_download"
            no-caps
            @click="exportTable"
          />
          <ConfirmButton
            v-if="selected.length > 0 && deleteSelection && deleteMutation"
            :button-props="{
              color: 'negative',
              iconRight: removeIcon,
              noCaps: true,
            }"
            :confirm-label="$t('general.confirm')"
            :label="removeLabel ?? $t('general.remove')"
            @click="deleteActiveRows"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
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
import { isString } from 'lodash-es';

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
    optionsMenu?: boolean;
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
    removeLabel: undefined,
    appendName: '',
    prependName: '',
    tableProps: () => ({}),
    optionsMenu: false,
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
  updateRowLocally,
  deleteActiveRows,
  deleteRow,
} = useDataTable(props.query, props.updateMutation, props.deleteMutation);

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
    const options = {
      name: 'options',
      field: 'options',
      label: '',
    };
    return [
      ...(props.prependSlot ? [prependContent] : []),
      ...props.columns,
      ...(props.appendSlot ? [appendContent] : []),
      ...(props.optionsMenu ? [options] : []),
    ];
  }
);
const extendedVisibleColumnNames: ComputedRef<string[]> = computed(() => {
  return [
    ...(props.prependSlot ? ['prepend'] : []),
    ...visibleColumnNames.value,
    ...(props.appendSlot ? ['append'] : []),
    ...(props.optionsMenu ? ['options'] : []),
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
  updateRowLocally,
});
</script>
