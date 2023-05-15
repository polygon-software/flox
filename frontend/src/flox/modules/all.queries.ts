/**
 * This file contains all valid GraphQL queries. A query is structured as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 * (auto-update on edit)
 * - tables: list of affected tables; when a mutation changes one of these tables, the query is re-fetched.
 * - cacheLocation: the actual GraphQL query's name (since cached data will be stored there)
 */
import { QueryObject } from 'src/apollo/query';
import { USER_QUERIES } from 'src/flox/modules/auth/user.query';
import { FILE_QUERIES } from 'src/flox/modules/file/file.query';
import { IMAGE_QUERIES } from 'src/flox/modules/image/image.query';
import { ACCESS_CONTROL_QUERIES } from 'src/flox/modules/access-control/access-control.query';
import { NOTIFICATION_QUERIES } from 'src/flox/modules/notification/notification.query';
import { PAYMENT_QUERIES } from 'src/flox/modules/payment/payment.query';
import { FORM_QUERIES } from 'src/data/form/form.query';

// Queries for all modules
export default [
  ...USER_QUERIES,
  ...FILE_QUERIES,
  ...IMAGE_QUERIES,
  ...ACCESS_CONTROL_QUERIES,
  ...NOTIFICATION_QUERIES,
  ...PAYMENT_QUERIES,
  ...FORM_QUERIES,
] as QueryObject[];
