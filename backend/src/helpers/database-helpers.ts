import { getConnection } from 'typeorm';

/**
 * This file contains all helper functions for fetching data from databases
 */

/**
 * Gets a prepared query runner for a given database
 * @param {string} database - database name (usually MR2000 or MR3000)
 * @returns {QueryRunner} - the query runner
 */
export async function getQueryRunner(database: string) {
  // Establish database connection
  const conn = getConnection(database);
  const queryRunner = conn.createQueryRunner();
  await queryRunner.connect();

  return queryRunner;
}

/**
 * Gets an array of the objects within a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {string} [filterQuery] - optional SQL filtering query
 * @returns {Record<string, unknown>[]} - database table contents
 */
export async function fetchFromTable(
  database: string,
  table: string,
  filterQuery?: string,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build query
  const query = `
      SELECT * FROM ${table}
      ${filterQuery ?? ''}
  `;
  // Execute
  const queryResult = await queryRunner.manager.query(query);

  await queryRunner.release();

  return queryResult;
}

/**
 * Gets number of objects within a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {string} [filterQuery] - optional SQL filtering query
 * @returns {number} - database table contents
 */
export async function fetchCountFromTable(
  database: string,
  table: string,
  filterQuery?: string,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build query
  const query = `
      SELECT count(*) FROM ${table}
      ${filterQuery ?? ''}
  `;
  // Execute
  const queryResult = await queryRunner.manager.query(query);

  await queryRunner.release();

  return queryResult;
}

/**
 * Writes the given record into a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {Record<string, unknown>} record - record to write to database
 * @returns {void}
 */
export async function insertIntoTable(
  database: string,
  table: string,
  record: Record<string, unknown>,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build statement
  const statement = `
      INSERT INTO ${table} (${Object.keys(record).join(',')})
      VALUES (${Object.values(record).join(',')});
  `;

  // Execute
  await queryRunner.manager.query(statement);
  await queryRunner.release();
}
