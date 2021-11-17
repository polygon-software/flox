import {COMPANY_MUTATIONS} from 'src/data/mutations/COMPANY';
import {USER_MUTATIONS} from 'src/data/mutations/USER';
/**
 * This file contains all valid GraphQL mutations. A mutation is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - mutation: the actual GraphQL mutation. Add __typename to the variables if the mutation UPDATES or CREATES data.
 * - tables: list of affected tables; when the mutation is executed, the corresponding queries are re-fetched.
 * - type: the mutation's type (either CREATE, DELETE or UPDATE); this determines cache handling
 * - cacheLocation: the actual GraphQL mutation's name (since cached data will be stored there)
 *
 */

export default {
  ...COMPANY_MUTATIONS, // Company module
  ...USER_MUTATIONS     // User module
}
