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
 * Updates and writes the given parameters from an objects in a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {string} [filterQuery] - SQL filtering query
 * @param {Record<string, unknown>} update - update Object with its parameters
 * @returns {void}
 */
export async function writeToTable(
  database: string,
  table: string,
  filterQuery: string,
  update: Record<string, unknown>,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build query
  let query = `
      UPDATE ${table}
      SET
  `;
  Object.entries(update).forEach(([key, value]) => {
    query += `${key} = ${value}, `;
  });
  query = query.substring(0, query.lastIndexOf(','));
  query += `
      ${filterQuery ?? ''}
  `;
  // Execute
  await queryRunner.manager.query(query);
  await queryRunner.release();
}
