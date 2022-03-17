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
    if (typeof value === 'string') {
      query += `${key} = "${value}", `;
    } else {
      query += `${key} = ${value}, `;
    }
  });
  query = query.substring(0, query.lastIndexOf(','));
  query += `
      ${filterQuery ?? ''}
  `;
  // Execute
  await queryRunner.manager.query(query);
  await queryRunner.release();
}

/**
 * Updates the mode of a device dependent on the old and new parameters
 * @param {string} oldAla1Mode - old ala1mode parameter
 * @param {string} oldAla2Mode - old ala2mode parameter
 * @param {boolean} newAla1Mode - new ala1mode parameter
 * @param {boolean} newAla2Mode - new ala2mode parameter
 * @param {Record<string, unknown>} update - update Object with its parameters
 * @returns {void}
 */
export function updateMode(
  oldAla1Mode: string,
  oldAla2Mode: string,
  newAla1Mode: boolean,
  newAla2Mode: boolean,
  update: Record<string, unknown>,
) {
  const enabledYes = 'enabled: YES';
  const enabledNo = 'enabled: NO';
  if (oldAla1Mode.includes(enabledNo) && newAla1Mode === true) {
    update['ala1_mode'] = enabledYes;
  }
  if (oldAla1Mode.includes(enabledYes) && newAla1Mode === false) {
    update['ala1_mode'] = enabledNo;
  }
  if (oldAla2Mode.includes(enabledNo) && newAla2Mode === true) {
    update['ala2_mode'] = enabledYes;
  }
  if (oldAla2Mode.includes(enabledYes) && newAla2Mode === false) {
    update['ala2_mode'] = enabledNo;
  }
}
