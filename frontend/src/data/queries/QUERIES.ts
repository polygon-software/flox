/**
 * This file contains all valid GraphQL queries. A query is structured as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 * (auto-update on edit)
 * - tables: list of affected tables; when a mutation changes one of these tables, the query is re-fetched.
 * - cacheLocation: the actual GraphQL query's name (since cached data will be stored there)
 */
import {QueryObject} from 'src/data/DATA-DEFINITIONS';
import {USER_QUERIES} from 'src/data/queries/USER';

// Queries for all modules
export const QUERIES: QueryObject[] = [
  ...USER_QUERIES,
];
