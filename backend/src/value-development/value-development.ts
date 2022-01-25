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
  const defaultCodeName = 'MS_Code'; // Default name of code column; replaced with 'region'
  const columnNames = Object.keys(parsedCsv[0]);
  const columns: TableColumn[] = [];

  columnNames.forEach((columnName) => {
    columns.push(
      new TableColumn({
        type: 'text', // TODO possibly parse values to numbers?
        name: columnName === defaultCodeName ? 'region' : columnName,
      }),
    );
  });

  // Set up database connection and query runner
  const connection: Connection = getConnection();
  const queryRunner: QueryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  const tableExists = await queryRunner.hasTable(tableName);
  console.log('Table exists?', tableExists);

  // Discard existing table, if any
  if (tableExists) {
    console.log('Drop table!');
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
