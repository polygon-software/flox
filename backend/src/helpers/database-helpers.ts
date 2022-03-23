import { getConnection, QueryRunner } from 'typeorm';

/**
 * This file contains all helper functions for fetching data from databases
 */

/**
 * Gets a prepared query runner for a given database
 * @param {string} database - database name (usually MR2000 or MR3000)
 * @returns {Promise<QueryRunner>} - the query runner
 */
export async function getQueryRunner(database: string): Promise<QueryRunner> {
  // Establish database connection
  const conn = getConnection(database);
  const queryRunner = conn.createQueryRunner();
  await queryRunner.connect();

  return queryRunner;
}

export type QueryHelperOptions = {
  where?: Record<string, string | number> | string;
  order_by?: string;
  limit?: {
    skip: number;
    take: number;
  };
};

/**
 * Build a query string from a where option in a TableQuery object
 * @param {Record<string, string | number> | string} option - where option
 * @returns {string} - WHERE query
 */
function buildWhereQuery(option: Record<string, string | number> | string) {
  if (typeof option === 'string') {
    return ` WHERE ${option}`;
  } else {
    let query = ' WHERE';
    Object.entries(option).forEach(([key, value]) => {
      query += ` ${key} =`;
      query += typeof value === 'string' ? ` '${value}' AND` : ` ${value} AND`;
    });
    query = query.substring(0, query.length - 4); // remove trailing " AND"
    return query;
  }
}

/**
 * Gets an array of the objects within a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {QueryHelperOptions} [options] - optional SQL filtering, ordering, limiting
 * @returns {Record<string, unknown>[]} - database table contents
 */
export async function fetchFromTable(
  database: string,
  table: string,
  options?: QueryHelperOptions,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build query
  let query = `SELECT * FROM ${table}`;
  if (options) {
    if (options.where) {
      query += buildWhereQuery(options.where);
    }
    if (options.order_by) {
      query += ` ORDER BY ${options.order_by}`;
    }
    if (options.limit) {
      query += ` LIMIT ${options.limit.skip}, ${options.limit.take}`;
    }
  }

  // Execute
  const queryResult = await queryRunner.manager.query(query);
  await queryRunner.release();
  return queryResult;
}

/**
 * Gets number of objects within a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {QueryHelperOptions} [options] - optional SQL filtering, ordering, limiting
 * @returns {number} - database table content count
 */
export async function fetchCountFromTable(
  database: string,
  table: string,
  options?: QueryHelperOptions,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build query
  let query = `SELECT count(*) FROM ${table}`;
  if (options?.where) {
    query += buildWhereQuery(options.where);
  }

  // Execute
  const queryResult = await queryRunner.manager.query(query);
  await queryRunner.release();
  return queryResult[0]['count(*)'];
}

/**
 * Writes the given record into a given database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {Record<string, unknown>} record - record to write to database
 * @returns {unknown} - query result
 */
export async function insertIntoTable(
  database: string,
  table: string,
  record: Record<string, unknown>,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build list of values (e.g. "some","other","value", 1, 0)
  let values = '';
  Object.values(record).forEach((value) => {
    values += typeof value === 'string' ? `"${value}",` : `${value},`;
  });
  values = values.substring(0, values.lastIndexOf(','));

  // Build query
  const query = `
    INSERT INTO ${table} (${Object.keys(record).join(',')})
    VALUES (${values});
  `;

  // Execute
  const queryResult = await queryRunner.manager.query(query);
  await queryRunner.release();
  return queryResult;
}

/**
 * Updates a given record in a database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {QueryHelperOptions} [options] - optional SQL filtering
 * @param {Record<string, unknown>} record - update Object with its parameters
 * @returns {unknown} - query result
 */
export async function updateInTable(
  database: string,
  table: string,
  options: QueryHelperOptions,
  record: Record<string, unknown>,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build query
  let query = `UPDATE ${table}`;
  query += ' SET';
  Object.entries(record).forEach(([key, value]) => {
    if (typeof value === 'string') {
      query += ` ${key}='${value}',`;
    } else {
      query += ` ${key}=${value},`;
    }
  });
  query = query.substring(0, query.length - 1); // remove trailing ","
  if (options?.where) {
    query += buildWhereQuery(options.where);
  }

  // Execute
  const queryResult = await queryRunner.manager.query(query);
  await queryRunner.release();
  return queryResult;
}

/**
 * Deletes a given record in a database table
 * @param {string} database - database name
 * @param {string} table - table name
 * @param {QueryHelperOptions} [options] - optional SQL filtering
 * @returns {unknown} - query result
 */
export async function deleteInTable(
  database: string,
  table: string,
  options: QueryHelperOptions,
) {
  // Get query runner
  const queryRunner = await getQueryRunner(database);

  // Build whole query
  let query = `DELETE FROM ${table}`;
  if (options?.where) {
    query += buildWhereQuery(options.where);
  }

  // Execute
  const queryResult = await queryRunner.manager.query(query);
  await queryRunner.release();
  return queryResult;
}
