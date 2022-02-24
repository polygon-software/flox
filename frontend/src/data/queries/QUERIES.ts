import {USER_QUERIES} from 'src/data/queries/USER';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';
import {DEVICE_QUERIES} from 'src/data/queries/DEVICE';
import {PROJECT_QUERIES} from 'src/data/queries/PROJECT';

/**
 * This file contains all valid GraphQL queries. A query is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 * (auto-update on edit)
 * - tables: list of affected tables; when a mutation changes one of these tables, the query is re-fetched.
 * - cacheLocation: the actual GraphQL query's name (since cached data will be stored there)
 *
 */


// Queries for all modules
export const QUERIES: QueryObject[] = [
  ...USER_QUERIES,
  ...DEVICE_QUERIES,
  ...PROJECT_QUERIES
];
