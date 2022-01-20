import DOSSIER_QUERIES from 'src/data/queries/DOSSIER';
import USER_QUERIES from 'src/data/queries/USER';
import COMPANY_QUERIES from 'src/data/queries/COMPANY';
import EMPLOYEE_QUERIES from 'src/data/queries/EMPLOYEE';
import FILE_QUERIES from 'src/data/queries/FILE';
import BANK_QUERIES from 'src/data/queries/BANK';
import SOI_EMPLOYEE_QUERIES from 'src/data/queries/SOI_EMPLOYEE';

/**
 * This file contains all valid GraphQL queries. A query is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 *  this is also needed on sub-queries!
 * (auto-update on edit)
 * - tables: list of affected tables; when a mutation changes one of these tables, the query is re-fetched.
 * - cacheLocation: the actual GraphQL query's name (since cached data will be stored there)
 *
 * When adding a new query, also add it to the QUERIES array at the bottom of this file.
 */




export const QUERIES = [
  ...DOSSIER_QUERIES,
  ...USER_QUERIES,
  ...COMPANY_QUERIES,
  ...EMPLOYEE_QUERIES,
  ...FILE_QUERIES,
  ...BANK_QUERIES,
  ...SOI_EMPLOYEE_QUERIES
];
