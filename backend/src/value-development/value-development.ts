import {
  Connection,
  getConnection,
  Not,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';
/**
 * This file contains all functionalities related to the saving and fetching of value development data
 */

const valueTableName = 'value_development';
const zipCodeTableName = 'zip_codes';

/**
 * Persists a parsed development CSV file to the database's 'value_development' ta le
 * @param {Record<string, unknown>[]} parsedCsv - CSV parsed to object array
 * @returns {Promise<void>} - done
 */
export async function saveValueDevelopmentCsv(
  parsedCsv: Record<string, unknown>[],
) {
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
  const tableExists = await queryRunner.hasTable(valueTableName);
  if (tableExists) {
    await queryRunner.dropTable(valueTableName);
  }

  // Create table with proper columns
  await queryRunner.createTable(
    new Table({
      name: valueTableName,
      columns,
    }),
  );

  // Insert values into table
  await queryRunner.manager.insert(valueTableName, parsedCsv);
}

// TODO docstrings
// eslint-disable-next-line require-jsdoc
export async function getValueDevelopment(
  zipCode: string,
  start: Date,
  end?: Date,
) {
  console.log('Find value development for', zipCode, start, end);

  // Set up database connection and query runner
  const connection: Connection = getConnection();
  const queryRunner: QueryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  // Ensure both needed tables exist
  const valueTableExists = await queryRunner.hasTable(valueTableName);
  const zipTableExists = await queryRunner.hasTable(zipCodeTableName);
  if (!valueTableExists || !zipTableExists) {
    throw new Error('missing table'); // TODO from constants
  }

  // Get zip code -> region mapping
  const zipCodeMapping = (await queryRunner.manager.findOne(zipCodeTableName, {
    zip_code: zipCode,
  })) as Record<string, unknown>;

  if (!zipCodeMapping) {
    throw new Error('no zipcode mapping found'); // TODO
  }

  // Extract region code
  const regionCode = zipCodeMapping.region;
  console.log('Region code is', regionCode);

  // Get region -> value mapping
  const valueMapping = (await queryRunner.manager.findOne(valueTableName, {
    region: regionCode,
  })) as Record<string, unknown>;

  if (!zipCodeMapping) {
    throw new Error('no value mapping found'); // TODO
  }

  console.log('value mapping is', valueMapping);
}
