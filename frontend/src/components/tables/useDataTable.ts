import {ref, Ref, nextTick, toRaw, watch, ComputedRef, computed} from 'vue';
import {executeMutation, executeQuery} from 'src/helpers/data/data-helpers';
import {MutationObject, QueryObject} from 'src/data/DATA-DEFINITIONS';
import {exportFile, QInputProps, useQuasar} from 'quasar';
import {cloneDeep} from 'lodash-es';
import {showNotification} from 'src/helpers/tools/notification-helpers';
import {i18n} from 'boot/i18n';
import {BaseEntity} from 'src/data/types/BaseEntity';
import CountQuery from 'src/data/types/CountEntity';

export interface ColumnInterface<T = any> {
  name: string,
  label: string,
  field: string | ((row: T) => string),
  required?: boolean,
  align?: string,
  sortable?: boolean,
  sort?: ((a: any, b: any, rowA: T, rowB: T) => number),
  sortOrder?: string,
  format?: (val: any, row?: T) => string,
  style?: string | ((row: T) => string),
  classes?: string | ((row: T) => string),
  headerStyle?: string,
  edit?: boolean,
  qInputProps?: QInputProps
}

/**
 * Composable to create a data table
 * @param {QueryObject} queryObject - query to perform to fetch data
 * @param {MutationObject} mutationObject - mutation to change a row entry
 * @param {MutationObject} deletionObject - mutation to delete a row entry
 * @param {string} sortBy - key to sort by
 * @param {boolean} descending - sort order
 * @param {number} rowsPerPage - Default number of rows per page
 * @returns {}
 */
export function useDataTable<T extends BaseEntity>(queryObject: QueryObject, mutationObject: MutationObject, deletionObject: MutationObject, sortBy='uuid', descending=false, rowsPerPage=10) {
  const $q = useQuasar();
  let storedSelectedRow: T;

  const rows: Ref<T[]> = ref([])
  const selected: Ref<T[]> = ref([]);
  const columns: Ref<ColumnInterface<T>[]> = ref([]);
  const visibleColumnNames: Ref<string[]> = ref([]);
  const visibleColumns: ComputedRef<ColumnInterface<T>[]> = computed(() => {
    return columns.value.filter((column) => visibleColumnNames.value.includes(column.name));
  })
  const filter: Ref<string> = ref('')
  const loading: Ref<boolean> = ref(false)
  const pagination: Ref<{sortBy: string, descending: boolean, page: number, rowsPerPage: number, rowsNumber: number}> = ref({
    sortBy,
    descending,
    page: 1,
    rowsPerPage,
    rowsNumber: 0
  })

  watch(columns, () => {
    visibleColumnNames.value = columns.value.map((column) => column.name);
  })

  /**
   * Fetches Data from the Server
   * @param {number} skip - how many items to skip
   * @param {number} limit - how many items to take
   * @param {string} filter - search input
   * @param {string} sortBy - attribute name
   * @param {boolean} descending - sort order
   * @returns {Promise<CountQuery<T>>} rows from server and count of total rows fitting criteria
   */
  async function fetchFromServer (skip: number, limit: number, filter: string, sortBy: string, descending: boolean): Promise<{ data: T[], count: number }> {
    const queryResult = await executeQuery<CountQuery<T>>(queryObject, { skip, limit, filter, sortBy, descending });
    return queryResult.data;
  }

  /**
   * Loads new data from server
   * @param {{ pagination: { page: number, rowsPerPage: number, sortBy: string, descending: boolean }, filter: string }} dataProps - props input
   * @returns {Promise<void>} nothing
   */
  async function onRequest(dataProps: { pagination: { page: number, rowsPerPage: number, sortBy: string, descending: boolean }, filter: string }) {
    const { filter } = dataProps;
    const { page, rowsPerPage, sortBy, descending } = dataProps.pagination;

    loading.value = true;

    const startRow = (page - 1) * rowsPerPage;

    const { count, data } = await fetchFromServer(startRow, rowsPerPage, filter, sortBy, descending);
    pagination.value.rowsNumber = count;

    rows.value.splice(0, rows.value.length, ...data);

    // don't forget to update local pagination object
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
    pagination.value.sortBy = sortBy;
    pagination.value.descending = descending;

    // ...and turn of loading indicator
    loading.value = false;
  }

  /**
   * Wraps a row entry in preparation for the CSV export
   * @param {string} val - Value to be exported
   * @param {function} formatFn - optional format function
   * @param {Object<string, any>[]} row - Row in which value is stored
   * @returns {string} CSV as string
   */
  function wrapCsvValue (val: any, formatFn?: (val: any, row?: T) => string, row?: T): string {
    let formatted = formatFn !== void 0
      ? formatFn(val, row)
      : String(val)

    formatted = formatted === void 0 || formatted === null
      ? ''
      : String(formatted)

    formatted = formatted.split('"').join('""')
    return `"${formatted}"`
  }

  /**
   * Exports a table as a CSV-File
   * @returns {void} nothing
   */
  function exportTable () {
    // naive encoding to csv format
    const content = [visibleColumnNames.value.map(name => wrapCsvValue(name))].concat(
      selected.value.map(row => visibleColumnNames.value.map(name => {
        const col = columns.value.find((col) => col.name === name);
        if (!col) { return; }
        let fieldVal: any;
        if (typeof col.field === 'function') {
          fieldVal = col.field(row);
        } else {
          const colHasField = col.field === void 0;
          const colKey: string = colHasField ? col.name : col.field;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          fieldVal = (row as Record<string, any>)[colKey];
        }
        return wrapCsvValue(fieldVal, col.format, row)
      }).join(','))
    ).join('\r\n')

    const status = exportFile(
      'export.csv',
      content,
      'text/csv'
    )

    if (status !== true) {
      $q.notify({
        message: 'Browser denied file download...',
        color: 'negative',
        icon: 'warning'
      })
    }
  }

  /**
   * Function that handles selections using CTRL and SHIFT keys
   * @param {T[]} newlySelected - rows that were newly selected
   * @param {boolean} added - whether the rows were selected or de-selected
   * @param {KeyboardEvent} evt - Javascript event that contains keys
   * @returns {Promise<void>} nothing
   */
  async function handleSelection ({ rows: newlySelected, added, evt }: { rows: T[], added: boolean, evt: KeyboardEvent}) {
    // ignore selection change from header of not from a direct click event
    if (newlySelected.length !== 1 || evt === void 0) {
      return
    }

    const oldSelectedRow = storedSelectedRow
    const newSelectedRow = newlySelected[0];

    const { ctrlKey, shiftKey } = evt

    if (!shiftKey) {
      storedSelectedRow = newSelectedRow
    }

    // wait for the default selection to be performed
    await nextTick();
    if (shiftKey) {
      const tableRows = rows.value;
      let firstIndex = tableRows.indexOf(oldSelectedRow)
      let lastIndex = tableRows.indexOf(newSelectedRow)

      if (firstIndex < 0) {
        firstIndex = 0
      }

      if (firstIndex > lastIndex) {
        [ firstIndex, lastIndex ] = [ lastIndex, firstIndex ]
      }

      const rangeRows = tableRows.slice(firstIndex, lastIndex + 1)
      // we need the original row object so we can match them against the rows in range
      const selectedRows = selected.value.map(toRaw)

      selected.value = added
        ? selectedRows.concat(rangeRows.filter((row: T) => !(selectedRows.includes(row))))
        : selectedRows.filter((row: T) => !(rangeRows.includes(row)))
    }
    else if (!ctrlKey && added) {
      selected.value = [newSelectedRow]
    }
  }

  /**
   * Handles sending row updates to database
   * @param {T} row - row to be updated
   * @param {string} path - path to key that must be updated
   * @param {any} value - new value at key location
   * @returns {Promise<void>} nothing
   */
  async function updateRow(row: T, path: keyof T, value: any): Promise<void> {
    const correctRowIndex = rows.value.findIndex((r) => {
      if ('uuid' in row && 'uuid' in r) {
        return row.uuid === r.uuid;
      }
      return false;
    });
    if(correctRowIndex > -1) {
      const rowCopy = cloneDeep(toRaw(rows.value[correctRowIndex]))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      rowCopy[path] = value;
      rows.value.splice(correctRowIndex, 1, rowCopy);
      try {
        await executeMutation(mutationObject, rowCopy as Record<string, unknown>);
        showNotification(
          $q,
          i18n.global.t('messages.entry_edited'),
          'top-right',
          'positive',
          'white',
          'done',
          false,
          500,
        );
      } catch (e) {
        showNotification(
          $q,
          i18n.global.t('errors.entry_edit_failed'),
          'top-right',
          'negative',
          'white',
          'clear',
          false,
          500,
        );
      }
    }
  }

  /**
   * Deletes all selected rows
   * @returns {Promise<T[]>} updated rows
   */
  function deleteActiveRows(): Promise<PromiseSettledResult<(Awaited<T>|void|null|undefined)>[]> {
    const deletionRequests = selected.value.map((selectedRow: T) => {
      return executeMutation<T>(deletionObject, toRaw(selectedRow) as Record<string, unknown>)
        .then((data) => {
          showNotification(
            $q,
            i18n.global.t('messages.entry_deleted'),
            'top-right',
            'positive',
            'white',
            'done',
            false,
            500,
          );
          return data.data;
        })
        .catch((e) => {
          console.error(e);
          showNotification(
            $q,
            i18n.global.t('errors.entry_delete_failed'),
            'top-right',
            'negative',
            'white',
            'clear',
            false,
            500,
          );
        });
    })
    return Promise.allSettled(deletionRequests);
  }

  return {
    rows, columns, visibleColumns, selected, visibleColumnNames, filter, loading, pagination, onRequest, exportTable, handleSelection, updateRow, deleteActiveRows,
  }
}
