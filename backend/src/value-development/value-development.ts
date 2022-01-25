import {
  Connection,
  getConnection,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';
/**
 * This file contains all functionalities related to the saving and fetching of value development data
 */

/**
 * Persists a parsed development CSV file to the database's 'value_development' ta le
 * @param {Record<string, unknown>[]} parsedCsv - CSV parsed to object array
 * @returns {Promise<void>} - done
 */
export async function saveValueDevelopmentCsv(
  parsedCsv: Record<string, unknown>[],
) {
  const tableName = 'value_development';
  const defaultCodeName = 'MS_Code'; // Default code column; replaced with 'region'
  const defaultRegionName = 'MS_Name'; // Default name column; replaced with 'region_name'
  const columnNames = Object.keys(parsedCsv[0]);
  const columns: TableColumn[] = [];

  // Generate columns (with special handling for region name & code)
  columnNames.forEach((columnName) => {
    let column;
    switch (columnName) {
      case defaultRegionName:
        column = new TableColumn({ type: 'text', name: 'region_name' });
        break;
      case defaultCodeName:
        column = new TableColumn({ type: 'text', name: 'region' });
        break;
      default:
        column = new TableColumn({
          type: 'double precision',
          name: columnName,
        });
    }
    columns.push(column);
  });

  // Set up database connection and query runner
  const connection: Connection = getConnection();
  const queryRunner: QueryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  // Discard existing table, if any
  const tableExists = await queryRunner.hasTable(tableName);
  if (tableExists) {
    await queryRunner.dropTable(tableName);
  }

  // Create table with proper columns
  await queryRunner.createTable(
    new Table({
      name: tableName,
      columns,
    }),
  );

  // Insert values into table
  await queryRunner.manager.insert(tableName, parsedCsv);
}
