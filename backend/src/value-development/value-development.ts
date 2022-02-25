import {
  Connection,
  getConnection,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';
import { ERRORS } from '../error/ERRORS';
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
  await queryRunner.release();
}

/**
 * Calculates the value increase multiplier for a given zip code over a given time period by using statistical
 * value development data stored in the database
 * @param {string} zipCode - zip code
 * @param {Date} start - start date of time period
 * @param {Date} end - end date of time period
 * @returns {number} - value multiplier to apply
 */
export async function getValueDevelopment(
  zipCode: string,
  start: Date,
  end: Date,
) {
  // Set up database connection and query runner
  const connection: Connection = getConnection();
  const queryRunner: QueryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  // Ensure both needed tables exist
  const valueTableExists = await queryRunner.hasTable(valueTableName);
  const zipTableExists = await queryRunner.hasTable(zipCodeTableName);
  if (!valueTableExists || !zipTableExists) {
    await queryRunner.release();
    throw new Error(ERRORS.missing_database_data);
  }

  // Get zip code -> region mapping directly via SQL because we're cool like that
  const zipCodeQuery = await queryRunner.manager.query(`
    SELECT *
    FROM ${zipCodeTableName}
    WHERE zip_code='${zipCode}'
    LIMIT 1
    `);

  // Ensure we have data for the given zip code
  if (!zipCodeQuery || zipCodeQuery.length === 0) {
    await queryRunner.release();
    throw new Error(ERRORS.invalid_zip_code);
  }

  const zipCodeMapping = zipCodeQuery[0];

  // Extract region code
  const regionCode = zipCodeMapping.region;

  // Get region -> value development mapping
  const valueMappingQuery = await queryRunner.manager.query(`
    SELECT *
    FROM ${valueTableName}
    WHERE region='${regionCode}'
    LIMIT 1
    `);

  if (!valueMappingQuery) {
    await queryRunner.release();
    throw new Error(ERRORS.missing_database_data);
  }
  const valueMapping = valueMappingQuery[0];

  // Get column names
  let startKey = getColumnNameForDate(start);
  let endKey = getColumnNameForDate(end);

  // Find oldest & newest data in value mapping
  let keys = Object.keys(valueMapping);
  keys = keys.filter((key) => key !== regionNameColumn && key !== regionColumn);
  keys = keys.sort();
  const oldestKey = keys[0];
  const newestKey = keys[keys.length - 1];

  // If data older than oldest is requested, use oldest column instead
  if (oldestKey > startKey) {
    startKey = oldestKey;
  } else if (newestKey < startKey) {
    // Special case: if oldest is also newer than any data present
    startKey = newestKey;
  }
  // If data newer than newest is requested, use newest column instead
  if (newestKey < endKey) {
    endKey = newestKey;
  } else if (oldestKey > endKey) {
    endKey = oldestKey;
  }

  const startValue = valueMapping[startKey];
  const endValue = valueMapping[endKey];

  await queryRunner.release();

  // Limit result to 4 decimal points & return
  return parseFloat((endValue / startValue).toFixed(4));
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

/**
 * Determines whether the given zip code is valid (present within database)
 * @param {string} zipCode - zip code
 * @returns {boolean} - whether it's valid
 */
export async function isZipCodeValid(zipCode: string) {
  // Set up database connection and query runner
  const connection: Connection = getConnection();
  const queryRunner: QueryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  // Ensure needed table exists
  const zipTableExists = await queryRunner.hasTable(zipCodeTableName);
  if (!zipTableExists) {
    await queryRunner.release();
    throw new Error(ERRORS.missing_database_data);
  }

  // Get zip code -> region mapping directly via SQL because we're cool like that
  const zipCodeQuery = await queryRunner.manager.query(`
    SELECT *
    FROM ${zipCodeTableName}
    WHERE zip_code='${zipCode}'
    LIMIT 1
    `);

  // Check whether we have data for the given zip code
  const isValid = zipCodeQuery && zipCodeQuery.length > 0;
  await queryRunner.release();

  return isValid;
}
