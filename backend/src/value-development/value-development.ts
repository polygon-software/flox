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

// Database table names
const valueTableName = 'value_development';
const zipCodeTableName = 'zip_codes';
const regionColumn = 'region';
const regionNameColumn = 'region_name';

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
        column = new TableColumn({ type: 'text', name: regionNameColumn });
        break;
      case defaultCodeName:
        column = new TableColumn({ type: 'text', name: regionColumn });
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

// TODO docstrings, split up more
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

  // Get zip code -> region mapping directly via SQL because we're cool like that
  const zipCodeQuery = await queryRunner.manager.query(`
    SELECT *
    FROM ${zipCodeTableName}
    WHERE zip_code='${zipCode}'
    LIMIT 1
    `);

  if (!zipCodeQuery || zipCodeQuery.length === 0) {
    throw new Error('no zipcode mapping found'); // TODO
  }

  const zipCodeMapping = zipCodeQuery[0];

  // Extract region code
  const regionCode = zipCodeMapping.region;
  console.log('Region code is', regionCode);

  // Get region -> value development mapping
  const valueMappingQuery = await queryRunner.manager.query(`
    SELECT *
    FROM ${valueTableName}
    WHERE region='${regionCode}'
    LIMIT 1
    `);

  if (!valueMappingQuery) {
    throw new Error('no value mapping found'); // TODO
  }
  const valueMapping = valueMappingQuery[0];

  // Get column names
  const startColumnName = getColumnNameForDate(start);
  const endColumnName = getColumnNameForDate(end);

  // TODO limiter if columns not available (earliest/latest)
  let startKey = valueMapping[startColumnName];
  let endKey = valueMapping[endColumnName];

  // Find oldest & newest data in value mapping
  let keys = Object.keys(valueMapping);
  keys = keys.filter((key) => key !== regionNameColumn && key !== regionColumn);
  keys = keys.sort();
  const oldestKey = keys[0];
  const newestKey = keys[keys.length - 1];

  // If data older than oldest is requested, use oldest column instead
  if (oldestKey > startKey) {
    startKey = oldestKey;
  }
  // If data newer than newest is requested, use oldest column instead
  if (newestKey < endKey) {
    endKey = newestKey;
  }

  console.log('Start:', startKey, ', end:', endKey);
}

/**
 * Gets the corresponding quarter column name for a given date
 * @param {Date} date - the date to check
 * @returns {string} - column name, e.g. 20123 for Date(2012-08-25)
 */
function getColumnNameForDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;

  return `${year}${quarter}`;
}
