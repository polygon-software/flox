import {ref, Ref, nextTick, toRaw, watch} from 'vue';
import {executeQuery} from 'src/helpers/data/data-helpers';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';
import {exportFile, useQuasar} from 'quasar';

/**
 * Composable to create a data table
 * @param {QueryObject} query - query to perform to fetch data
 * @param {string} sortBy - key to sort by
 * @param {boolean} descending - sort order
 * @param {number} rowsPerPage - Default number of rows per page
 */
export function useDataTable<T>(query: QueryObject, sortBy='uuid', descending=false, rowsPerPage=10) {
  const $q = useQuasar();
  let storedSelectedRow: T;

  const rows: Ref<T[]> = ref([])
  const selected: Ref<T[]> = ref([]);
  const columns: Ref<{name: string, label: string, field: string | ((row: T) => string), format?: (val: any, row?: T) => string, sortable?: boolean}[]> = ref([]);
  const visibleColumns: Ref<string[]> = ref([]);
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
    visibleColumns.value = columns.value.map((column) => column.name);
  })

  /**
   * Fetches Data from the Server
   * @param {number} skip - how many items to skip
   * @param {number} limit - how many items to take
   * @param {string} filter - search input
   * @param {string} sortBy - attribute name
   * @param {boolean} descending - sort order
   * @returns {Promise<{ data: T[], count: number }>} rows from server and count of total rows fitting criteria
   */
  async function fetchFromServer (skip: number, limit: number, filter: string, sortBy: string, descending: boolean): Promise<{ data: T[], count: number }> {
    const queryResult = await executeQuery(query, { skip, limit, filter, sortBy, descending });
    const data = queryResult.data[query.cacheLocation] as unknown as { data: T[], count: number };
    return {
      data: data.data ,
      count: data.count,
    };
  }

  /**
   * Loads new data from server
   * @param {{ pagination: { page: number, rowsPerPage: number, sortBy: string, descending: boolean }, filter: string }} dataProps - props input
   * @returns {Promise<void>}
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
   * @param {val: string, row?: T[]) => string} formatFn - optional format function
   * @param {Object<string, any>[]} row - Row in which value is stored
   */
  function wrapCsvValue (val: any, formatFn?: (val: any, row?: T) => string, row?: T) {
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
   */
  function exportTable () {
    // naive encoding to csv format
    const content = [visibleColumns.value.map(name => wrapCsvValue(name))].concat(
      selected.value.map(row => visibleColumns.value.map(name => {
        const col = columns.value.find((col) => col.name === name);
        if (!col) { return; }
        let fieldVal: string;
        if (typeof col.field === 'function') {
          fieldVal = col.field(row);
        } else {
          const colHasField = col.field === void 0;
          const colKey: string = colHasField ? col.name : col.field;
          fieldVal = (row as Record<string, string>)[colKey];
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

  async function handleSelection ({ rows: newlySelected, added, evt }: { rows: T[], added: boolean, evt: Event}) {
    // ignore selection change from header of not from a direct click event
    if (newlySelected.length !== 1 || evt === void 0) {
      return
    }

    const oldSelectedRow = storedSelectedRow
    const newSelectedRow = newlySelected[0];
    const { ctrlKey, shiftKey } = evt

    if (shiftKey !== true) {
      storedSelectedRow = newSelectedRow
    }

    // wait for the default selection to be performed
    await nextTick();
    if (shiftKey === true) {
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
    else if (ctrlKey !== true && added) {
      selected.value = [newSelectedRow]
    }
  }

  return {
    rows, columns, selected, visibleColumns, filter, loading, pagination, onRequest, exportTable, handleSelection,
  }
}
