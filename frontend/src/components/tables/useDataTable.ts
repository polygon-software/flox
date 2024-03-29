import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import get from 'lodash/get';
import { exportFile, QInputProps, useQuasar } from 'quasar';
import { computed, ComputedRef, nextTick, Ref, ref, toRaw, watch } from 'vue';

import { i18n } from 'boot/i18n';
import { executeMutation, MutationObject } from 'src/apollo/mutation';
import { executeQuery, QueryObject } from 'src/apollo/query';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';
import { entityToMutationVariables } from 'src/tools/graphql.tool';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';

export interface PageRequest {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}

export interface PaginationConfig extends PageRequest {
  rowsNumber: number;
}

export interface PageParameters {
  skip: number;
  take: number;
  sortBy: string;
  descending: boolean;
  filter?: string;
}

export enum ColumnAlign {
  center = 'left',
  left = 'left',
  right = 'right',
}

export enum ColumnSortOrder {
  ascending = 'ad',
  descending = 'da',
}

export enum CellType {
  editString = 'editString',
  editBoolean = 'editBoolean',
  boolean = 'boolean',
  other = 'other',
}

export interface ColumnInterface<T = any> {
  name: string;
  label: string;
  field: string | ((row: T) => any);
  required?: boolean;
  align?: ColumnAlign;
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: T, rowB: T) => number;
  sortOrder?: ColumnSortOrder;
  format?: (val: any, row?: T) => string;
  style?: string | ((row: T) => string);
  classes?: string | ((row: T) => string);
  headerStyle?: string;
  edit?: boolean;
  qInputProps?: Omit<QInputProps, 'modelValue'>;
}

/**
 * Composable to create a data table
 *
 * @param queryObject - query to perform to fetch data
 * @param updateObject - mutation to change a row entry
 * @param deletionObject - mutation to delete a row entry
 * @param sortBy - key to sort by
 * @param descending - sort order
 * @param rowsPerPage - Default number of rows per page
 * @param multi - Whether multi-selection of rows is allowed
 * @returns complete setup for a data table
 */
export function useDataTable(
  queryObject: QueryObject,
  updateObject?: MutationObject,
  deletionObject?: MutationObject,
  sortBy = 'createdAt',
  descending = true,
  rowsPerPage = 10,
  multi = false
): {
  rows: Ref<BaseEntity[]>;
  columns: Ref<ColumnInterface<BaseEntity>[]>;
  visibleColumns: ComputedRef<ColumnInterface<BaseEntity>[]>;
  selected: Ref<BaseEntity[]>;
  visibleColumnNames: Ref<string[]>;
  filter: Ref<string>;
  loading: Ref<boolean>;
  pagination: Ref<PaginationConfig>;
  onRequest: (dataProps: {
    pagination: PageRequest;
    filter?: string;
  }) => Promise<void>;
  exportTable: () => void;
  handleSelection: ({
    rows,
    added,
    evt,
  }: {
    rows: readonly BaseEntity[];
    added: boolean;
    evt: Event;
  }) => Promise<void>;
  updateRow: (row: BaseEntity, path: string, value: any) => Promise<void>;
  updateRowLocally: (row: BaseEntity, path: string, value: any) => BaseEntity;
  deleteActiveRows: () => Promise<
    PromiseSettledResult<Awaited<BaseEntity> | void | null | undefined>[]
  >;
  deleteRow: (row: BaseEntity) => Promise<BaseEntity | null | undefined | void>;
} {
  const $q = useQuasar();
  let storedSelectedRow: BaseEntity;

  const rows: Ref<BaseEntity[]> = ref([]);
  const selected: Ref<BaseEntity[]> = ref([]);
  const columns: Ref<ColumnInterface<BaseEntity>[]> = ref([]);
  const visibleColumnNames: Ref<string[]> = ref([]);
  const visibleColumns: ComputedRef<ColumnInterface<BaseEntity>[]> = computed(
    () => {
      return columns.value.filter((column) =>
        visibleColumnNames.value.includes(column.name)
      );
    }
  );
  const filter: Ref<string> = ref('');
  const loading: Ref<boolean> = ref(false);
  const pagination: Ref<PaginationConfig> = ref({
    sortBy,
    descending,
    page: 1,
    rowsPerPage,
    rowsNumber: 0,
  });

  watch(columns, () => {
    visibleColumnNames.value = columns.value.map((column) => column.name);
  });

  /**
   * Fetches Data from the Server
   *
   * @param pageRequest - contains parameters for requesting a data page
   * @returns rows from server and count of total rows fitting criteria
   */
  async function fetchFromServer(
    pageRequest: PageParameters
  ): Promise<{ data: BaseEntity[]; count: number }> {
    const queryResult = await executeQuery<CountQuery<BaseEntity>>(
      queryObject,
      pageRequest
    );
    return queryResult.data;
  }

  /**
   * Loads new data from server
   *
   * @param dataProps - props input
   * @param dataProps.pagination - includes skip, take etc.
   * @param dataProps.filter - user specified input for filtering the table
   */
  async function onRequest(dataProps: {
    pagination: PageRequest;
    filter?: string;
  }): Promise<void> {
    const { filter: filterProp } = dataProps;
    const {
      page: paginationPage,
      rowsPerPage: paginationRowsPerPage,
      sortBy: paginationSortBy,
      descending: paginationDescending,
    } = dataProps.pagination;

    const paginationTake = paginationRowsPerPage || 500;

    loading.value = true;

    const paginationSkip = (paginationPage - 1) * paginationTake;

    const { count, data } = await fetchFromServer({
      skip: paginationSkip,
      take: paginationTake,
      filter: filterProp,
      sortBy: paginationSortBy,
      descending: paginationDescending,
    });
    pagination.value.rowsNumber = count;

    rows.value.splice(0, rows.value.length, ...data);

    // don't forget to update local pagination object
    pagination.value.page = paginationPage;
    pagination.value.rowsPerPage = paginationRowsPerPage;
    pagination.value.sortBy = paginationSortBy;
    pagination.value.descending = paginationDescending;

    // ...and turn off loading indicator
    loading.value = false;
  }

  /**
   * Wraps a row entry in preparation for the CSV export
   *
   * @param val - Value to be exported
   * @param formatFn - optional format function
   * @param row - Row in which value is stored
   * @returns CSV as string
   */
  function wrapCsvValue(
    val: any,
    formatFn?: (val: any, row?: BaseEntity) => string,
    row?: BaseEntity
  ): string {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : String(val);

    formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted);

    formatted = formatted.split('"').join('""');
    return `"${formatted}"`;
  }

  /**
   * Exports a table as a CSV-File
   */
  function exportTable(): void {
    // naive encoding to csv format
    const content = [visibleColumnNames.value.map((name) => wrapCsvValue(name))]
      .concat(
        selected.value.map((row) =>
          visibleColumnNames.value
            .map((name) => {
              const col = columns.value.find((c) => c.name === name);
              if (!col) {
                return undefined;
              }
              let fieldVal: any;
              if (typeof col.field === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                fieldVal = col.field(row);
              } else {
                const colHasField = col.field === void 0;
                const colKey: string = colHasField ? col.name : col.field;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                fieldVal = get(row, colKey);
              }
              return wrapCsvValue(fieldVal, col.format, row);
            })
            .join(',')
        )
      )
      .join('\r\n');

    const status = exportFile('export.csv', content, 'text/csv');

    if (status !== true) {
      $q.notify({
        message: 'Browser denied file download...',
        color: 'negative',
        icon: 'warning',
      });
    }
  }

  /**
   * Function that handles selections using CTRL and SHIFT keys
   *
   * @param selection - new selection from table
   * @param selection.rows - rows that were newly selected
   * @param selection.added - whether the rows were selected or de-selected
   * @param selection.evt - Javascript event that contains keys
   */
  async function handleSelection({
    rows: newlySelected,
    added,
    evt,
  }: {
    rows: readonly BaseEntity[];
    added: boolean;
    evt: Event;
  }): Promise<void> {
    // ignore selection change from header of not from a direct click event
    if (newlySelected.length !== 1 || evt === void 0 || !multi) {
      return;
    }

    const oldSelectedRow = storedSelectedRow;
    const newSelectedRow = newlySelected[0];

    const { ctrlKey, shiftKey } = evt as KeyboardEvent;

    if (!shiftKey) {
      storedSelectedRow = newSelectedRow;
    }

    // wait for the default selection to be performed
    await nextTick();
    if (shiftKey) {
      const tableRows = rows.value;
      let firstIndex = tableRows.indexOf(oldSelectedRow);
      let lastIndex = tableRows.indexOf(newSelectedRow);

      if (firstIndex < 0) {
        firstIndex = 0;
      }

      if (firstIndex > lastIndex) {
        [firstIndex, lastIndex] = [lastIndex, firstIndex];
      }

      const rangeRows = tableRows.slice(firstIndex, lastIndex + 1);
      // we need the original row object so we can match them against the rows in range
      const selectedRows = selected.value.map(toRaw);

      selected.value = added
        ? selectedRows.concat(
            rangeRows.filter((row: BaseEntity) => !selectedRows.includes(row))
          )
        : selectedRows.filter((row: BaseEntity) => !rangeRows.includes(row));
    } else if (!ctrlKey && added) {
      selected.value = [newSelectedRow];
    }
  }

  /**
   * Handles local row updates
   *
   * @param row - row to be updated
   * @param path - path to key that must be updated
   * @param value - new value at key location
   * @returns updated copy of the given row
   */
  function updateRowLocally(
    row: BaseEntity,
    path: string,
    value: any
  ): BaseEntity {
    const correctRowIndex = rows.value.findIndex((r) => row.uuid === r.uuid);
    if (correctRowIndex === -1) {
      throw new Error('Row to be updated could not be identified');
    } else {
      const rawRow = toRaw(rows.value[correctRowIndex]);
      const rowCopy = cloneDeep(rawRow);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      set(rowCopy, path, value);
      rows.value.splice(correctRowIndex, 1, rowCopy);
      const selectedRowIndex = selected.value.findIndex(
        (r) => row.uuid === r.uuid
      );
      if (selectedRowIndex > -1) {
        selected.value.splice(selectedRowIndex, 1, rowCopy);
      }
      return rowCopy;
    }
  }

  /**
   * Handles sending row updates to database
   *
   * @param row - row to be updated
   * @param path - path to key that must be updated
   * @param value - new value at key location
   */
  async function updateRow(
    row: BaseEntity,
    path: string,
    value: any
  ): Promise<void> {
    if (!updateObject) {
      throw new Error('Unable to update row - update query not provided');
    }
    const updatedRowCopy = updateRowLocally(row, path, value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    try {
      const mutationVariables = entityToMutationVariables(
        updatedRowCopy,
        updateObject
      );
      await executeMutation(updateObject, mutationVariables);
      showSuccessNotification($q, i18n.global.t('messages.entry_edited'), {
        timeout: 500,
      });
    } catch (e) {
      showErrorNotification($q, i18n.global.t('errors.entry_edit_failed'), {
        timeout: 500,
      });
    }
  }

  /**
   * Delete a single row.
   */
  async function deleteRow(row: BaseEntity): Promise<void> {
    if (!deletionObject) {
      throw new Error('Unable to delete row - delete query not provided');
    }
    return executeMutation<BaseEntity>(deletionObject, toRaw(row))
      .then(() => {
        showSuccessNotification($q, i18n.global.t('messages.entry_deleted'), {
          timeout: 500,
        });
      })
      .catch((e) => {
        console.error(e);
        showErrorNotification($q, i18n.global.t('errors.entry_delete_failed'), {
          timeout: 500,
        });
      });
  }

  /**
   * Deletes all selected rows.
   */
  async function deleteActiveRows(): Promise<PromiseSettledResult<void>[]> {
    if (!deletionObject) {
      throw new Error('Unable to delete row - delete query not provided');
    }
    const deletionUuids = selected.value.map((val) => val.uuid);
    const deletionRequests = selected.value.map(deleteRow);
    rows.value = rows.value.filter((row) => !deletionUuids.includes(row.uuid));
    selected.value = [];
    return Promise.allSettled(deletionRequests);
  }

  return {
    rows,
    columns,
    visibleColumns,
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
  };
}
