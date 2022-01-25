import { parse } from 'csv-parse';
import {
  Connection,
  getConnection,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';

/**
 * This file contains all helper functions related to handling CSV files
 */

/**
 * Parses a CSV file to an object array, getting column names from the first row
 * @param {Buffer} fileBuffer - CSV file as buffer
 * @param {string} [delimiter] - value separator, default is tab (\t)
 * @returns {Promise<Record<string, string>[]>} - CSV file converted to object
 */
export async function parseCsv(fileBuffer: Buffer, delimiter = '\t') {
  // Parse input as string
  return new Promise(async (resolve, reject) => {
    parse(
      fileBuffer.toString(),
      {
        delimiter: delimiter, // Value separator
        columns: true, // Auto-discover column names from first CSV line
      },
      (error, result: Record<string, string>[]) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      },
    );
  });
}

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
